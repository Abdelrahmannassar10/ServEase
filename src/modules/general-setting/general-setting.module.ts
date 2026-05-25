import { Module } from '@nestjs/common';
import { GeneralSettingService } from './general-setting.service';
import { GeneralSettingController } from './general-setting.controller';
import { GeneralSetting, GeneralSettingRepository, generalSettingSchema } from '@models/index';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GeneralSetting.name, schema: generalSettingSchema },
    ]),
  ],
  controllers: [GeneralSettingController],
  providers: [GeneralSettingService ,GeneralSettingRepository],
  exports: [GeneralSettingService],
})
export class GeneralSettingModule {}
