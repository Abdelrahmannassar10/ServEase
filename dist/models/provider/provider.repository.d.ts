import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HProviderDocument } from './provider.schema';
export declare class ProviderRepository extends AbstractRepository<HProviderDocument> {
    private readonly providerModel;
    constructor(providerModel: Model<HProviderDocument>);
}
