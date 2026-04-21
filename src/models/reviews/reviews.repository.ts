import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { review } from './review.schema';

@Injectable()
export class ReviewRepository extends AbstractRepository<review> {
  constructor(@InjectModel(review.name) private readonly providerModel: Model<review>) {
    super(providerModel);
  }
}
