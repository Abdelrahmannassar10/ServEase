import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserMongooseModule } from '@shared/modules';
import { AuthFactoryService } from './factory';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '@common/strategy/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LocalStrategy } from '@common/strategy';
import { JwtStrategy } from '@common/strategy/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistToken, BlacklistTokenSchema } from '@models/token/token.schema';
import { TokenRepository } from '@models/token/token.repository';
import { CloudinaryService } from '@common/cloudinary';

@Module({
  imports: [
    UserMongooseModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MongooseModule.forFeature([{ name: BlacklistToken.name, schema: BlacklistTokenSchema }]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFactoryService,
    GoogleStrategy,
    LocalStrategy,
    JwtStrategy,
    TokenRepository,
    CloudinaryService
  ],
  exports: [AuthService],
})
export class AuthModule {}
