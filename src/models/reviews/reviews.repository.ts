import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Review } from './review.schema';

@Injectable()
export class ReviewRepository extends AbstractRepository<Review> {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<Review>) {
    super(reviewModel);
  }
}
