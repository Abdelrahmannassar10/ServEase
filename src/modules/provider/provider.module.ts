import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { UserMongooseModule } from '@shared/modules';

@Module({
  imports: [UserMongooseModule],
  controllers: [ProviderController],
  providers: [ProviderService],
})
export class ProviderModule {}
