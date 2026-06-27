import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { UserMongooseModule } from '@shared/modules';
import { ServiceRequestModule } from '@modules/service-request/service-request.module';
import { ServiceModule } from '@modules/service/service.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatSessionMongooseModule } from '@shared/modules';

@Module({
  imports: [
    ChatSessionMongooseModule,
    UserMongooseModule,
    AuthModule,
    ServiceRequestModule,
    ServiceModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ secret: config.get('JWT_SECRET') }),
    }),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
