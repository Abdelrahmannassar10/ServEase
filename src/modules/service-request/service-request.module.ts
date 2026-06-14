import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongooseModule } from '@shared/modules';
import { GeneralSettingModule } from '../general-setting/general-setting.module';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import { ProviderOfferRepository } from '../../models/provider-offer/provider-offer.repository';
import {
  ServiceRequest,
  serviceRequestSchema,
} from '../../models/service-request/service-request.schema';
import {
  ProviderOffer,
  providerOfferSchema,
} from '../../models/provider-offer/provider-offer.schema';

@Module({
  imports: [
    UserMongooseModule,
    GeneralSettingModule,
    MongooseModule.forFeature([
      {
        name: ServiceRequest.name,
        schema: serviceRequestSchema,
      },
      {
        name: ProviderOffer.name,
        schema: providerOfferSchema,
      },
    ]),
  ],
  controllers: [ServiceRequestController],
  providers: [
    ServiceRequestService,
    ServiceRequestFactoryService,
    ServiceRequestRepository,
    ProviderOfferRepository,
  ],
  exports: [ServiceRequestService, ServiceRequestRepository, ProviderOfferRepository],
})
export class ServiceRequestModule {}