import { Role } from '@common/types/enum';
import { AuthService } from '@modules/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class AdminLocalStrategy extends PassportStrategy(
  Strategy,
  'admin-local',
) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    console.log(email,password);
    
    const user = await this.authService.validateAdmin(email, password);
    console.log(user);
    

    if (!user || user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Admin access only');
    }

    return user;
  }
}
