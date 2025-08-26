import { formatFileSize } from '@app/lib/format-file-size';
import { imageUrl } from '@app/lib/image-url';
import { IPlace } from './place.type';

export const placesDTOMapper = (places: IPlace[]) => {
  return places.map((images) => placeDTOMapper(images));
};

export const placeDTOMapper = (place: IPlace) => {
  return {
    id: place.id,
    title: place.title,
    description_id: place.description_id,
    description_mi: place.description_mi,
    description_en: place.description_en,
    address: place.address,
    reviewSummary: {
      totalReviews: place.reviewSummary.totalReviews,
      totalValidRatings: place.reviewSummary.totalValidRatings,
      totalRating: place.reviewSummary.totalRating,
      averageRating: place.reviewSummary.averageRating,
    },
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
