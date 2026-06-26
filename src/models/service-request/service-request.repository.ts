import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { AbstractRepository } from '../abstract.repository';
import {
  ServiceRequest,
  HServiceRequestDocument,
} from './service-request.schema';
import { RequestType, ServiceStatus } from '@common/types/enum';

@Injectable()
export class ServiceRequestRepository extends AbstractRepository<HServiceRequestDocument> {
  constructor(
    @InjectModel(ServiceRequest.name)
    private readonly serviceRequestModel: Model<HServiceRequestDocument>,
  ) {
    super(serviceRequestModel);
  }

  async findByCustomerId(customerId: string) {
    return this.serviceRequestModel
      .find({ customerId })
      .populate({
        path: 'providerId',
        select:
          'firstName lastName userName dob age profileURL averageRating reviewsCount service hourPrice',
        populate: {
          path: 'service',
          select: '_id name icon_text',
        },
      })
      .sort({ createdAt: -1 });
  }

  async findBroadcastsByCustomerId(customerId: string) {
    return this.serviceRequestModel
      .find({ customerId, requestType: RequestType.BROADCAST })
      .sort({ createdAt: -1 });
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

  async findConfirmedProviderTimeConflict(
    providerId: string | Types.ObjectId,
    dateNeeded: Date,
    startTime: string,
  ) {
    const dayStart = new Date(dateNeeded);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dateNeeded);
    dayEnd.setHours(23, 59, 59, 999);

    return this.serviceRequestModel.findOne({
      providerId: {
        $in: [
          providerId,
          new Types.ObjectId(providerId.toString()),
        ],
      },
      status: ServiceStatus.CONFIRMED,
      dateNeeded: {
        $gte: dayStart,
        $lte: dayEnd,
      },
      $or: [
        { startTime },
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime },
        },
      ],
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
    return this.serviceRequestModel
      .findById(id)
      .populate({
        path: 'providerId',
        select:
          'firstName lastName userName dob age profileURL mobileNumber email service hourPrice',
        populate: {
          path: 'service',
          select: '_id name icon_text',
        },
      })
      .populate({
        path: 'customerId',
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
