import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import devConfig from './config/env/dev.config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { Admin, adminSchema, Customer, customerSchema, Provider, providerSchema, User, userSchema } from './models';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from '@common/helper/cron-job.helper';
import { UserMongooseModule } from '@shared/modules';
import { CustomerModule } from './modules/customer/customer.module';
import { ProviderModule } from './modules/provider/provider.module';
import { CommonModule } from './modules/common/common.module';
import { AdminModule } from './modules/admin/admin.module';
import { AdminModule } from './modules/admin/admin.module';

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
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService,TasksService],
})
export class AppModule {}
