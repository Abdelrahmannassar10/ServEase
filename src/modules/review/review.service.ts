import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';
import { ReviewType } from '@common/types/enum';
import { ProviderRepository } from '@models/index';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository ,private readonly providerRepository: ProviderRepository) {}

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
    const providerExist = await this.providerRepository.findById(review.ProviderId as unknown as string);
    if (!providerExist) {
      throw new Error('Provider not found');
    }
    const result = await this.reviewRepository.create(review);
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
}
