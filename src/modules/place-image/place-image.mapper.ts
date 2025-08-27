import { PlaceImage } from '@prisma/client';
import { formatFileSize } from '@app/lib/format-file-size';
import { imageUrl } from '@app/lib/image-url';

export const placeImagesDTOMapper = (placeImages: PlaceImage[]) => {
  return placeImages.map((images) => placeImageDTOMapper(images));
};

export const placeImageDTOMapper = (placeImage: PlaceImage) => {
  return {
    id: placeImage.id,
    imagePath: imageUrl(placeImage.imagePath),
    imageFile: placeImage.imageFile,
    imageSize: formatFileSize(placeImage.imageSize),
    createdAt: placeImage.createdAt,
    updatedAt: placeImage.updatedAt,
  };
};
