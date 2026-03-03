import { UserRepository } from '@models/index';
import { TokenRepository } from '@models/token/token.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService, private readonly tokenRepository: TokenRepository,private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
  const token = req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    throw new UnauthorizedException('No token provided');
  }

  const isBlacklisted = await this.tokenRepository.isBlacklisted(token);
  if (isBlacklisted) {
    throw new UnauthorizedException('Token is blacklisted');
  }
  const user = await this.userRepository.findById(payload._id);
  if(user?.changeCredentialTimestamp && payload.iat * 1000 < user.changeCredentialTimestamp.getTime()){
    throw new UnauthorizedException('Token is invalid due to credential change');
  }

  return {
    email: payload.email,
    _id: payload._id,
    role: payload.role,
    userName: payload.userName,
  };
}
}
