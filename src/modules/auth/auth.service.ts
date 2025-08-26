import { OAuth2Client } from 'google-auth-library';
import crypto from 'node:crypto';
import { env } from '@app/config/env';
import { comparePassword, hashPassword } from '@app/lib/hash';
import { signAccessToken } from '@app/lib/jwt';
import { prisma } from '@app/lib/prisma';

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export class AuthService {
  private googleClient = env.googleClientId ? new OAuth2Client(env.googleClientId) : undefined;

  async register(email: string, password: string, name?: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email already registered');
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({ data: { email, passwordHash, name } });
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refresh = await this.issueRefreshToken(user.id);

    return { user, accessToken, refreshToken: refresh.token, expiresAt: refresh.expiresAt };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refresh = await this.issueRefreshToken(user.id);

    return { user, accessToken, refreshToken: refresh.token, expiresAt: refresh.expiresAt };
  }

  async refresh(refreshToken: string) {
    const token = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!token) throw new Error('Invalid refresh token');
    if (token.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: token.id } });
      throw new Error('Refresh token expired');
    }
    const user = await prisma.user.findUnique({ where: { id: token.userId } });
    if (!user) throw new Error('User not found');

    // rotate
    await prisma.refreshToken.delete({ where: { id: token.id } });
    const newRefresh = await this.issueRefreshToken(user.id);
    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return { user, accessToken, refreshToken: newRefresh.token, expiresAt: newRefresh.expiresAt };
  }

  async googleSignIn(idToken: string) {
    if (!this.googleClient) throw new Error('Google sign-in not configured');
    const ticket = await this.googleClient.verifyIdToken({ idToken, audience: env.googleClientId });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub) throw new Error('Invalid Google token');

    const googleId = payload.sub;
    const email = payload.email || `${googleId}@googleuser.local`;
    const name = payload.name || payload.given_name || undefined;

    let user = await prisma.user.findFirst({ where: { OR: [{ googleId }, { email }] } });
    if (!user) {
      user = await prisma.user.create({ data: { email, googleId, name } });
    } else if (!user.googleId) {
      user = await prisma.user.update({ where: { id: user.id }, data: { googleId } });
    }

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const refresh = await this.issueRefreshToken(user.id);
    return { user, accessToken, refreshToken: refresh.token, expiresAt: refresh.expiresAt };
  }

  private async issueRefreshToken(userId: string) {
    const token = crypto.randomUUID();
    const expiresAt = addDays(new Date(), env.refreshTokenExpiresDays);
    const created = await prisma.refreshToken.create({ data: { token, userId, expiresAt } });
    return created;
  }
}

export const authService = new AuthService();
