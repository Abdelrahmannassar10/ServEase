import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Review } from './review.schema';
export declare class ReviewRepository extends AbstractRepository<Review> {
    private readonly reviewModel;
    constructor(reviewModel: Model<Review>);
}
