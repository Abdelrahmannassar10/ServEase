import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from './config/env/dev.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from '@common/helper/cron-job.helper';
import { UserMongooseModule } from '@shared/modules';
import { CustomerModule } from './modules/customer/customer.module';
import { ProviderModule } from './modules/provider/provider.module';
import { CommonModule } from './modules/common/common.module';
import { ServiceModule } from './modules/service/service.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReviewModule } from './modules/review/review.module';
import { ServiceRequestModule } from '@modules/service-request/service-request.module';
import { GeneralSettingModule } from './modules/general-setting/general-setting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [devConfig],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('db').url,
      }),
    })
    ,
    AuthModule,
    ScheduleModule.forRoot(),
    UserMongooseModule,
    CustomerModule,
    ProviderModule,
    CommonModule,
    AdminModule,
    ServiceModule,
    ReviewModule,
    ServiceRequestModule,
    GeneralSettingModule,
  ],
  controllers: [AppController],
  providers: [AppService,TasksService],
})
export class AppModule {}
