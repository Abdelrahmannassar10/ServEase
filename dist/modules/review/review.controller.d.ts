import { ReviewService } from './review.service';
import { ReviewFactoryService } from './factory';
import { globalReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    private readonly reviewFactoryService;
    constructor(reviewService: ReviewService, reviewFactoryService: ReviewFactoryService);
    globalReview(globalReviewDto: globalReviewDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
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
