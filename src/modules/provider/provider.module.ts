import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { UserMongooseModule } from '@shared/modules';
import { ServiceModule } from '@modules/service/service.module';
import { ServiceRequestModule } from '@modules/service-request/service-request.module';

@Module({
  imports: [UserMongooseModule, ServiceModule, ServiceRequestModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
