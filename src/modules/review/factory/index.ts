import { ReviewType } from "@common/types/enum";
import { globalReviewDto, RequestReviewDto } from "../dto/create-review.dto";
import { Review } from "../entities/review.entity";

export class ReviewFactoryService{
    globalReview(globalReviewDto :globalReviewDto,userId:any){
        const review = new Review()
        review.userId = userId
        review.rate = globalReviewDto.rate
        review.content = globalReviewDto.content
        review.status = ReviewType.GLOBAL
        return review
    }
    requestReview(requestReviewDto :RequestReviewDto  ,userId:any){
        const review = new Review()
        review.userId = userId
        review.rate = requestReviewDto.rate
        review.content = requestReviewDto.content
        review.ProviderId = requestReviewDto.providerId
        review.requestId = requestReviewDto.orderId
        review.status = ReviewType.REQUEST
        return review
    }
}