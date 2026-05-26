import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { CloudinaryService } from '@common/cloudinary';
import { UserMongooseModule } from '@shared/modules';
import { ReviewModule } from '@modules/review/review.module';
import { ServiceRequestModule } from '@modules/service-request/service-request.module';

@Module({
  imports: [UserMongooseModule ,ReviewModule ,ServiceRequestModule],
  controllers: [CommonController],
  providers: [CommonService,CloudinaryService ],
})
export class CommonModule {}
