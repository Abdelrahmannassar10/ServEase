import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HUserDocument } from './user.schema';
export declare class UserRepository extends AbstractRepository<HUserDocument> {
    private readonly userModel;
    constructor(userModel: Model<HUserDocument>);
}
