import { env } from '@app/config/env';

export const imageUrl = (imagePath: string) => {
  return `${env.host}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};
