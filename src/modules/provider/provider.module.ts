import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { UserMongooseModule } from '@shared/modules';
import { ServiceModule } from '@modules/service/service.module';

@Module({
  imports: [UserMongooseModule, ServiceModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
