import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, serviceSchema } from '@models/service/service.schema';
import { ServiceRepository } from '@models/service/service.repository';
import { ProviderModule } from '@modules/provider/provider.module';
import { UserMongooseModule } from '@shared/modules';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }]),
    UserMongooseModule
  ],
  controllers: [ServiceController],
  providers: [ServiceService,ServiceRepository],
  exports: [ServiceService ,ServiceRepository],
})
export class ServiceModule {}
