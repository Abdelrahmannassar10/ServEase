import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, serviceSchema } from '@models/service/service.schema';
import { ServiceRepository } from '@models/service/service.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }]),
  ],
  controllers: [ServiceController],
  providers: [ServiceService,ServiceRepository],
})
export class ServiceModule {}
