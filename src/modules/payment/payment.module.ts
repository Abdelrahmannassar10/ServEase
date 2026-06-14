import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { UserMongooseModule } from '@shared/modules';

@Module({
  imports: [UserMongooseModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}