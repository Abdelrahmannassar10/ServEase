import { globalReviewDto } from "../dto/create-review.dto";
import { Review } from "../entities/review.entity";

export class ReviewFactoryService{
    globalReview(globalReviewDto :globalReviewDto){
        const review = new Review()
        review.userId = globalReviewDto.userId
        review.rate = globalReviewDto.rate
        review.content = globalReviewDto.content
        return review
    }
}