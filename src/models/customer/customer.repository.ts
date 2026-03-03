import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { Customer, HCustomerDocument } from './customer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerRepository extends AbstractRepository<HCustomerDocument> {
  constructor(@InjectModel(Customer.name) private readonly customerModel: Model<HCustomerDocument>) {
    super(customerModel);
  }
}
