import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { UserMongooseModule } from '@shared/modules';
import { ProviderFactoryService } from './factory';

@Module({
  imports: [UserMongooseModule],
  controllers: [ProviderController],
  providers: [ProviderService,ProviderFactoryService],
})
export class ProviderModule {}
