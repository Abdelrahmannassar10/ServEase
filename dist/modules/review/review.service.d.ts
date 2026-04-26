import { Review } from './entities/review.entity';
import { ReviewRepository } from '@models/reviews/reviews.repository';
import { ProviderRepository } from '@models/index';
export declare class ReviewService {
    private readonly reviewRepository;
    private readonly providerRepository;
    constructor(reviewRepository: ReviewRepository, providerRepository: ProviderRepository);
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
    requestReview(review: Review): Promise<import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getProviderReviews(providerId: any): Promise<(import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getRequestReviews(): Promise<(import("mongoose").Document<unknown, {}, import("../../models/reviews/review.schema").Review, {}, import("mongoose").DefaultSchemaOptions> & import("../../models/reviews/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
}
