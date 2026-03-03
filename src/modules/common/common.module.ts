import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { CloudinaryService } from '@common/cloudinary';
import { UserMongooseModule } from '@shared/modules';

@Module({
  imports: [UserMongooseModule],
  controllers: [CommonController],
  providers: [CommonService,CloudinaryService],
})
export class CommonModule {}
