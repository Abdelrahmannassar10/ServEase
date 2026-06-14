import { Model, Types } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HProviderDocument, Provider } from './provider.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { LocationScope, ProviderStatus } from '../../common/types/enum';

@Injectable()
export class ProviderRepository extends AbstractRepository<HProviderDocument> {
  constructor(@InjectModel(Provider.name) private readonly providerModel: Model<HProviderDocument>) {
    super(providerModel);
  }

  async findMatchingProviders(params: {
    serviceId: string;
    locationScope: LocationScope;
    governorate?: string;
    district?: string;
    matchByTopRated: boolean;
    topRatedMinRating?: number;
  }): Promise<{ _id: Types.ObjectId }[]> {
    const filter: Record<string, any> = {
      service: new Types.ObjectId(params.serviceId),
      adminApproved: ProviderStatus.Active,
      isDeleted: { $ne: true },
    };

    if (params.locationScope === LocationScope.GOVERNORATE && params.governorate) {
      filter['city'] = params.governorate;
    }
    if (params.locationScope === LocationScope.DISTRICT && params.district) {
      filter['state'] = params.district;
    }
    if (params.matchByTopRated) {
      filter['averageRating'] = { $gte: params.topRatedMinRating ?? 4.0 };
    }

    return this.providerModel.find(filter).select('_id').lean();
  }
}
