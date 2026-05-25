import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMongooseModule } from '@shared/modules';
import { GeneralSettingModule } from '../general-setting/general-setting.module';
import { ServiceRequestController } from './service-request.controller';
import { ServiceRequestService } from './service-request.service';
import { ServiceRequestFactoryService } from './factory';
import { ServiceRequestRepository } from '../../models/service-request/service-request.repository';
import {
  ServiceRequest,
  serviceRequestSchema,
} from '../../models/service-request/service-request.schema';

@Module({
  imports: [
    UserMongooseModule,
    GeneralSettingModule,
    MongooseModule.forFeature([
      {
        name: ServiceRequest.name,
        schema: serviceRequestSchema,
      },
    ]),
  ],
  controllers: [ServiceRequestController],
  providers: [
    ServiceRequestService,
    ServiceRequestFactoryService,
    ServiceRequestRepository,
  ],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}