import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HCategoryDocument } from './category.schema';
export declare class CategoryRepository extends AbstractRepository<HCategoryDocument> {
    private readonly categoryModel;
    constructor(categoryModel: Model<HCategoryDocument>);
}
