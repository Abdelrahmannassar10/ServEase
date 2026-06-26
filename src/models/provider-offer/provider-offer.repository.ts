import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { ProviderOffer, HProviderOfferDocument } from './provider-offer.schema';
import { OfferStatus } from '../../common/types/enum';

@Injectable()
export class ProviderOfferRepository extends AbstractRepository<HProviderOfferDocument> {
  constructor(
    @InjectModel(ProviderOffer.name)
    private readonly providerOfferModel: Model<HProviderOfferDocument>,
  ) {
    super(providerOfferModel);
  }

  async findPendingByProviderId(providerId: string): Promise<HProviderOfferDocument[]> {
    return this.providerOfferModel
      .find({ providerId: new Types.ObjectId(providerId), status: OfferStatus.PENDING })
      .populate({
        path: 'serviceRequestId',
        match: { status: 'OPEN' },
        select: '-completionCode -addedToProviderCalendar -__v -isDeleted',
      })
      .sort({ createdAt: -1 });
  }

  async findByRequestAndProvider(
    requestId: string,
    providerId: string,
  ): Promise<HProviderOfferDocument | null> {
    return this.providerOfferModel.findOne({
      serviceRequestId: new Types.ObjectId(requestId),
      providerId: new Types.ObjectId(providerId),
    });
  }

  async findActiveByRequestId(requestId: string): Promise<HProviderOfferDocument[]> {
    return this.providerOfferModel
      .find({
        serviceRequestId: new Types.ObjectId(requestId),
        status: { $nin: [OfferStatus.REFUSED, OfferStatus.EXPIRED] },
      })
      .populate(
        'providerId',
        'firstName lastName userName email profileURL averageRating service hourPrice city state',
      )
      .sort({ createdAt: -1 });
  }

  async expireOtherOffers(requestId: string, confirmedProviderId: string): Promise<void> {
    await this.providerOfferModel.updateMany(
      {
        serviceRequestId: new Types.ObjectId(requestId),
        providerId: { $ne: new Types.ObjectId(confirmedProviderId) },
        status: { $in: [OfferStatus.PENDING, OfferStatus.COUNTER_OFFER] },
      },
      { $set: { status: OfferStatus.EXPIRED, respondedAt: new Date() } },
    );
  }

  async expireAllOffers(requestId: string): Promise<void> {
    await this.providerOfferModel.updateMany(
      {
        serviceRequestId: new Types.ObjectId(requestId),
        status: { $in: [OfferStatus.PENDING, OfferStatus.COUNTER_OFFER] },
      },
      { $set: { status: OfferStatus.EXPIRED, respondedAt: new Date() } },
    );
  }
}
