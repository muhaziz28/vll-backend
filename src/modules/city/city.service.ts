import { prisma } from '@app/lib/prisma';

class CityService {
  async getAll() {
    return prisma.city.findMany();
  }

  async getFirstCity() {
    return prisma.city.findFirst({});
  }

  async getCityByName(name: string) {
    return prisma.city.findFirst({
      where: {
        name: {
          equals: name.toLowerCase(),
        },
      },
    });
  }

  async getCityById(id: number) {
    return prisma.city.findUnique({
      where: { id },
    });
  }
}

export const cityService = new CityService();
