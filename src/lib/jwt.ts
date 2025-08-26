import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '@app/config/env';

export type JwtPayload = {
  sub: string;
  email?: string;
  role: string;
};

export function signAccessToken(payload: JwtPayload): string {
  const secret: Secret = env.jwtSecret as unknown as Secret;
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  const secret: Secret = env.jwtSecret as unknown as Secret;
  return jwt.verify(token, secret) as JwtPayload;
}
