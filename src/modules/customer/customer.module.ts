import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UserMongooseModule } from '@shared/modules';

@Module({
  imports: [
    UserMongooseModule
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
