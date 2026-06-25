import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository, UserRepository } from '@models/index';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake?.auth?.token;
    if (!token) throw new UnauthorizedException('No token provided');

    const isBlacklisted = await this.tokenRepository.isBlacklisted(token);
    if (isBlacklisted) throw new UnauthorizedException('Token is blacklisted');

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById(payload._id as string);
    if (
      user?.changeCredentialTimestamp &&
      payload.iat * 1000 < user.changeCredentialTimestamp.getTime()
    ) {
      throw new UnauthorizedException('Token is invalid due to credential change');
    }

    client.data.user = { _id: payload._id, role: payload.role, email: payload.email };
    return true;
  }
}
