import { globalReviewDto, RequestReviewDto } from "../dto/create-review.dto";
import { Review } from "../entities/review.entity";
export declare class ReviewFactoryService {
    globalReview(globalReviewDto: globalReviewDto, userId: any): Review;
    requestReview(requestReviewDto: RequestReviewDto, userId: any): Review;
}
