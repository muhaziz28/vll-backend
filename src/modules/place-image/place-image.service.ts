import { prisma } from '@app/lib/prisma';
import { PlaceImageCreateInput } from './place-image.types';

class PlaceImageService {
  async list(placeId: number) {
    return prisma.placeImage.findMany({
      where: { placeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    return prisma.placeImage.findUnique({ where: { id } });
  }

  async getByPlaceId(placeId: number) {
    return prisma.placeImage.findFirst({ where: { placeId } });
  }

  async create(placeId: number, input: PlaceImageCreateInput) {
    return prisma.placeImage.create({
      data: {
        ...input,
        placeId,
      },
    });
  }

  async remove(id: number) {
    return prisma.placeImage.delete({ where: { id } });
  }
}

export const placeImageService = new PlaceImageService();
