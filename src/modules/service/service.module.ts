import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Service, serviceSchema } from '@models/service/service.schema';
import { ServiceRepository } from '@models/service/service.repository';
import { CategoryModule } from '@modules/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Service.name, schema: serviceSchema }]),
    CategoryModule,
  ],
  controllers: [ServiceController],
  providers: [ServiceService,ServiceRepository],
})
export class ServiceModule {}
