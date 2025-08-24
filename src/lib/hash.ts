import bcrypt from 'bcryptjs';

const DEFAULT_ROUNDS = 10;

export async function hashPassword(plain: string, rounds: number = DEFAULT_ROUNDS): Promise<string> {
  const salt = await bcrypt.genSalt(rounds);
  return bcrypt.hash(plain, salt);
}

export function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}