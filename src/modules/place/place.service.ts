/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@app/generated/prisma';
import { PaginatedResult, PaginationParams } from '@app/lib/paginate';
import { prisma } from '@app/lib/prisma';
import { PlaceCreateInput, PlaceUpdateInput } from './place.type';

class PlaceService {
  async list({ page = 1, limit = 10, search, isActive }: PaginationParams = {}): Promise<
    PaginatedResult<any>
  > {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);
    const skip = (validPage - 1) * validLimit;

    const where: Prisma.PlaceWhereInput = {};

    if (search) {
      where.OR = [{ title: { contains: search } }, { address: { contains: search } }];
    }

    if (isActive) {
      where.OR = [{ isActive }];
    }

    const [items, total] = await Promise.all([
      prisma.place.findMany({
        where,
        skip,
        take: validLimit,
      }),
      prisma.place.count({ where }),
    ]);

    return {
      items,
      total,
      page: validPage,
      limit: validLimit,
    };
  }

  async getById(id: number) {
    return prisma.place.findUnique({ where: { id } });
  }

  async create(input: PlaceCreateInput) {
    return prisma.place.create({ data: input });
  }

  async update(id: number, input: PlaceUpdateInput) {
    return prisma.place.update({
      where: {
        id,
      },
      data: {
        ...input,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    return prisma.place.delete({ where: { id } });
  }
}

export const placeService = new PlaceService();
