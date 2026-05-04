import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AbstractRepository } from '../abstract.repository';
import {
  ServiceRequest,
  HServiceRequestDocument,
} from './service-request.schema';

@Injectable()
export class ServiceRequestRepository extends AbstractRepository<HServiceRequestDocument> {
  constructor(
    @InjectModel(ServiceRequest.name)
    private readonly serviceRequestModel: Model<HServiceRequestDocument>,
  ) {
    super(serviceRequestModel);
  }

  async findByCustomerId(customerId: string) {
    return this.serviceRequestModel.find({ customerId });
  }

  async findByProviderId(providerId: string) {
    return this.serviceRequestModel.find({ providerId });
  }

  async findDuplicateRequest(
    customerId: string| Types.ObjectId,
    providerId: string| Types.ObjectId,
    dateNeeded: Date,
    startTime: string,
  ) {
    return this.serviceRequestModel.findOne({
      customerId,
      providerId,
      dateNeeded,
      startTime,
    });
  }
}