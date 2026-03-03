import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HCustomerDocument } from './customer.schema';
export declare class CustomerRepository extends AbstractRepository<HCustomerDocument> {
    private readonly customerModel;
    constructor(customerModel: Model<HCustomerDocument>);
}
