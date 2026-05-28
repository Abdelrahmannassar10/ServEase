import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AbstractRepository } from '../abstract.repository';
import {
  ServiceRequest,
  HServiceRequestDocument,
} from './service-request.schema';
import { ServiceStatus } from '@common/types/enum';

@Injectable()
export class ServiceRequestRepository extends AbstractRepository<HServiceRequestDocument> {
  constructor(
    @InjectModel(ServiceRequest.name)
    private readonly serviceRequestModel: Model<HServiceRequestDocument>,
  ) {
    super(serviceRequestModel);
  }

  async findByCustomerId(customerId: string) {
    return this.find(
      { customerId },
      {
        populate: ['providerId'],
        select: 'firstName lastName userName dob age profileURL averageRating reviewsCount',
        sort: { createdAt: -1 },
      },
    );
  }

  async findByProviderId(providerId: string) {
  return this.serviceRequestModel
    .find({
      providerId: {
        $in: [
          providerId,
          new Types.ObjectId(providerId),
        ],
      },
    })
    .populate(
      'customerId',
      'firstName lastName userName dob age profileURL mobileNumber email',
    )
    .sort({ createdAt: -1 });
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
  async findProviderCalendarRequests(providerId: string) {
    return this.find(
      {
        providerId,
        addedToProviderCalendar: true,
      },
      {
        populate: ['customerId'],
        sort: { dateNeeded: 1, startTime: 1 },
      },
    );
  }

  async findByIdWithUsers(id: string) {
    return this.findById(id, {
      populate: ['providerId', 'customerId'],
      select: 'firstName lastName userName dob age profileURL mobileNumber email',
    });
  }
async findOutdatedConfirmedRequests(date: Date) {
  return this.serviceRequestModel.find({
    status: ServiceStatus.CONFIRMED,
    scheduledEndAt: { $lte: date },
  });
}
}