import { prisma } from '@app/lib/prisma';
import { LanskapCreateInput, LanskapUpdateInput } from './lanskap.type';

class LanskapService {
  async getAll() {
    return prisma.lanskapLinguistik.findMany();
  }

  async getById(id: number) {
    return prisma.lanskapLinguistik.findUnique({
      where: { id },
    });
  }

  async create(input: LanskapCreateInput) {
    return prisma.lanskapLinguistik.create({ data: input });
  }

  async update(id: number, input: LanskapUpdateInput) {
    return prisma.lanskapLinguistik.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  async remove(id: number) {
    return prisma.lanskapLinguistik.delete({ where: { id } });
  }
}

export const lanskapService = new LanskapService();
