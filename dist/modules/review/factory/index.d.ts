import { globalReviewDto } from "../dto/create-review.dto";
import { Review } from "../entities/review.entity";
export declare class ReviewFactoryService {
    globalReview(globalReviewDto: globalReviewDto, userId: any): Review;
}
