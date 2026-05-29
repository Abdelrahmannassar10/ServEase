import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserMongooseModule } from '@shared/modules';
import { AdminFactoryService } from './factory';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminLocalStrategy } from '@common/strategy/admin-local.stratgy';
import { AuthModule } from '@modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GeneralSetting, generalSettingSchema } from '@models/index';
import { ServiceRequestModule } from '@modules/service-request/service-request.module';
import { GeneralSettingModule } from '@modules/general-setting/general-setting.module';

@Module({
  imports: [
    UserMongooseModule,
    MongooseModule.forFeature([
      {
        name: GeneralSetting.name,
        schema: generalSettingSchema,
      },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    AuthModule,
    ServiceRequestModule ,
    GeneralSettingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminFactoryService, AdminLocalStrategy],
})
export class AdminModule {}
