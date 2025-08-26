import { Banner } from '@app/generated/prisma';
import { formatFileSize } from '@app/lib/format-file-size';
import { imageUrl } from '@app/lib/image-url';

export const bannersDTOMapper = (banners: Banner[]) => {
  return banners.map((banner) => bannerDTOMapper(banner));
};

export const bannerDTOMapper = (banner: Banner) => {
  return {
    id: banner.id,
    bannerTitle: banner.bannerTitle,
    imagePath: imageUrl(banner.imagePath),
    imageFile: banner.imageFile,
    imageSize: formatFileSize(banner.imageSize),
    isActive: banner.isActive,
    createdAt: banner.createdAt,
    updatedAt: banner.updatedAt,
  };
};
