import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HProviderDocument, Provider } from './provider.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderRepository extends AbstractRepository<HProviderDocument> {
  constructor(@InjectModel(Provider.name) private readonly providerModel: Model<HProviderDocument>) {
    super(providerModel);
  }
}
