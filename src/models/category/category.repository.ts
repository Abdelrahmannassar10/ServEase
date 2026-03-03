import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Category, HCategoryDocument } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends AbstractRepository<HCategoryDocument> {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<HCategoryDocument>) {
    super(categoryModel);
  }
}
