import { prisma } from '@app/lib/prisma';
import { PlaceReviewCreateInput } from './place-review.types';

class PlaceReviewService {
  async getByPlace(placeId: number) {
    return prisma.placeReview.findMany({
      where: { placeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        placeReviewAttachment: true,
      },
    });
  }

  async createReview(placeId: number, userId: string, input: PlaceReviewCreateInput) {
    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.placeReview.create({
        data: {
          rating: input.rating,
          comment: input.comment,
          userId,
          placeId,
        },
      });

      let attachments;
      if (input.attachments && input.attachments.length > 0) {
        attachments = await tx.placeReviewAttachment.createMany({
          data: input.attachments.map((attachment) => ({
            placeReviewId: review.id,
            attachmentFile: attachment.imageFile,
            attachmentSize: attachment.imageSize,
            attachmentPath: attachment.imagePath,
          })),
        });
      }

      return { review, attachments };
    });

    return result;
  }
}

export const placeReviewService = new PlaceReviewService();
