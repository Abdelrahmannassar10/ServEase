import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { HServiceDocument, Service } from './service.schema';

@Injectable()
export class ServiceRepository extends AbstractRepository<HServiceDocument> {
  constructor(@InjectModel(Service.name) private readonly serviceModel: Model<HServiceDocument>) {
    super(serviceModel);
  }
}
