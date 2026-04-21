import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';
import { ReviewType } from '@common/types/enum';


@Injectable()
export class ReviewService {

  constructor(private readonly reviewRepository: ReviewRepository) {}
    
  async globalReview(review: Review) {
    const result = await this.reviewRepository.create(review)

    return result;
  }

  async getGlobalReviews() {
    return await this.reviewRepository.find({ status: ReviewType.GLOBAL} ).populate('userId', 'firstName lastName userName dob age profileUrl');
  }

}
