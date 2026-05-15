import { Injectable, NotFoundException } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';
import { ReviewType } from '@common/types/enum';
import { ProviderRepository } from '@models/index';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async globalReview(review: Review) {
    const result = await this.reviewRepository.create(review);

    return result;
  }

  async getGlobalReviews() {
    return await this.reviewRepository
      .find({ status: ReviewType.GLOBAL })
      .populate('userId', 'firstName lastName userName dob age profileUrl');
  }

  async requestReview(review: Review) {
    const providerExist = await this.providerRepository.findById(
      review.ProviderId as unknown as string,
    );

    if (!providerExist) {
      throw new NotFoundException('Provider not found');
    }

    const result = await this.reviewRepository.create(review);

    const currentAverage = Number(providerExist.averageRating);
    const currentCount = Number(providerExist.reviewsCount);

    const newCount = currentCount + 1;

    const newAverage = (currentAverage * currentCount + review.rate) / newCount;

    await this.providerRepository.updateById(
      review.ProviderId as unknown as string,
      { averageRating: Number(newAverage.toFixed(1)), reviewsCount: newCount },
    );

    return result;
  }

  async getProviderReviews(providerId: any) {
    return await this.reviewRepository
      .find({ ProviderId: providerId, status: ReviewType.REQUEST })
      .populate('userId', 'firstName lastName userName dob age profileUrl');
  }

  async getRequestReviews() {
    return await this.reviewRepository
      .find({ status: ReviewType.REQUEST })
      .populate('userId', 'firstName lastName userName dob age profileUrl')
      .populate('ProviderId', 'name profileUrl');
  }

  async deleteReview(reviewId: string) {
  const reviewExist = await this.reviewRepository.findById(reviewId);

  if (!reviewExist) {
    throw new NotFoundException('Review not found');
  }

  const providerId = reviewExist.ProviderId as unknown as string;

  await this.reviewRepository.deleteById(reviewId);

  const stats = await this.reviewRepository.aggregate([
    {
      $match: {
        ProviderId: reviewExist.ProviderId,
      },
    },
    {
      $group: {
        _id: '$ProviderId',
        averageRating: {
          $avg: '$rate',
        },
        reviewsCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (stats.length === 0) {
    await this.providerRepository.updateById(providerId, {
      averageRating: 0,
      reviewsCount: 0,
    });

    return {
      message: 'Review deleted successfully',
    };
  }

  await this.providerRepository.updateById(providerId, {
    averageRating: Number(stats[0].averageRating.toFixed(1)),
    reviewsCount: stats[0].reviewsCount,
  });

  return {
    message: 'Review deleted successfully',
  };
}
}
