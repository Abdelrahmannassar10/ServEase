import { Injectable } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';


@Injectable()
export class ReviewService {

  constructor(private readonly reviewRepository: ReviewRepository) {}
    
  async globalReview(review: Review) {
    return this.reviewRepository.create(review);
  }
}
