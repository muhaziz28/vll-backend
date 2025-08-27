/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma } from '@app/generated/prisma';
import { PaginatedResult, PaginationParams } from '@app/lib/paginate';
import { prisma } from '@app/lib/prisma';
import { PlaceCreateInput, PlaceUpdateInput } from './place.type';

class PlaceService {
  async list({ page = 1, limit = 10, search, isActive, cityId }: PaginationParams = {}): Promise<
    PaginatedResult<any>
  > {
    const validPage = Math.max(1, page);
    const validLimit = Math.min(Math.max(1, limit), 100);
    const skip = (validPage - 1) * validLimit;

    const where: Prisma.PlaceWhereInput = {};

    if (search) {
      where.OR = [{ title: { contains: search } }, { address: { contains: search } }];
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    const [items, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: {
          placeReview: {
            where: {
              isActive: true,
              rating: {
                gte: 0,
                lte: 5,
              },
            },
            select: {
              rating: true,
            },
          },
          city: true,
        },
        skip,
        take: validLimit,
      }),
      prisma.place.count({ where }),
    ]);

    const transformedItems = items.map((place) => {
      const reviews = place.placeReview;
      const totalReviews = reviews.length;

      const validRatings = reviews
        .map((review) => review.rating)
        .filter((rating) => rating !== null && rating >= 0 && rating <= 5);

      const totalRating = validRatings.reduce((sum, rating) => sum + rating, 0);
      const averageRating =
        validRatings.length > 0 ? Math.round((totalRating / validRatings.length) * 10) / 10 : 0;

      return {
        ...place,
        reviewSummary: {
          totalReviews,
          totalValidRatings: validRatings.length,
          totalRating,
          averageRating: Math.min(Math.max(averageRating, 0), 5),
        },
      };
    });

    return {
      items: transformedItems,
      total,
      page: validPage,
      limit: validLimit,
    };
  }

  async getById(id: number) {
    return prisma.place.findUnique({ where: { id } });
  }

  async create(input: PlaceCreateInput) {
    return prisma.place.create({ data: input, include: { city: true } });
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
      include: {
        city: true,
      },
    });
  }

  async remove(id: number) {
    return prisma.place.delete({ where: { id } });
  }
}

export const placeService = new PlaceService();
