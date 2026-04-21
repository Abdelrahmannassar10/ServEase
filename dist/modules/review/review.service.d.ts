import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';
export declare class ReviewService {
    private readonly reviewRepository;
    constructor(reviewRepository: ReviewRepository);
    globalReview(review: Review): Promise<import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getGlobalReviews(): Promise<(import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
