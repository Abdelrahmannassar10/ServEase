import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '@modules/auth/auth.module';
import { UserMongooseModule } from '@shared/modules';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatSessionMongooseModule } from '@shared/modules';

@Module({
  imports: [
    ChatSessionMongooseModule,
    UserMongooseModule,
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ secret: config.get('JWT_SECRET') }),
    }),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
