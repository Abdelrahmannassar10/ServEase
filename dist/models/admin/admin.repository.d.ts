import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HAdminDocument } from './admin.schema';
export declare class AdminRepository extends AbstractRepository<HAdminDocument> {
    private readonly adminModel;
    constructor(adminModel: Model<HAdminDocument>);
}
