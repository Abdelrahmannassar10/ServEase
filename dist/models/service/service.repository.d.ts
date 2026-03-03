import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HServiceDocument } from './service.schema';
export declare class ServiceRepository extends AbstractRepository<HServiceDocument> {
    private readonly serviceModel;
    constructor(serviceModel: Model<HServiceDocument>);
}
