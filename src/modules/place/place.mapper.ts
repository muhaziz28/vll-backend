import { Place } from '@app/generated/prisma';
import { formatFileSize } from '@app/lib/format-file-size';
import { imageUrl } from '@app/lib/image-url';

export const placesDTOMapper = (places: Place[]) => {
  return places.map((images) => placeDTOMapper(images));
};

export const placeDTOMapper = (place: Place) => {
  return {
    id: place.id,
    title: place.title,
    description_id: place.description_id,
    description_mi: place.description_mi,
    description_en: place.description_en,
    address: place.address,
    imageFile: place.imageFile,
    imageSize: formatFileSize(place.imageSize),
    imagePath: imageUrl(place.imagePath),
    latitude: place.latitude,
    longitude: place.longitude,
    city: place.city,
    province: place.province,
    isActive: place.isActive,
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
  };
};
