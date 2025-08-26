import { prisma } from '@app/lib/prisma';
import { BannerCreateInput, BannerUpdateInput } from './banner.types';

class BannerService {
  async list() {
    return prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: number) {
    return prisma.banner.findUnique({ where: { id } });
  }

  async create(input: BannerCreateInput) {
    return prisma.banner.create({ data: input });
  }

  async update(id: number, input: BannerUpdateInput) {
    return prisma.banner.update({
      where: { id },
      data: { ...input, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    return prisma.banner.delete({ where: { id } });
  }

  async getActiveBanners() {
    return prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export const bannerService = new BannerService();
