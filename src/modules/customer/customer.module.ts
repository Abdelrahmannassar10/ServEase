import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UserMongooseModule } from '@shared/modules';
import { CustomerFactoryService } from './factory';
import { CloudinaryService } from '@common/cloudinary';

@Module({
  imports: [
    UserMongooseModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerFactoryService,CloudinaryService],
})
export class CustomerModule {}
