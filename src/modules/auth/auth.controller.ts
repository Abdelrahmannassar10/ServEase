import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  UploadedFile,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerRegisterDto, ProviderRegisterDto } from './dto/register.dto';
import { AuthFactoryService } from './factory';
import { GoogleAuthGuard } from '@common/guard/google.guard';
import { AuthGuard } from '@nestjs/passport';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';
import { RolesGuard } from '@common/guard';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authFactoryService: AuthFactoryService,
  ) {}

  @Post('register/customer')
  async customerRegister(@Body() customerRegisterDto: CustomerRegisterDto) {
    const customer =
      await this.authFactoryService.createCustomer(customerRegisterDto);

    const { access_token, user } =
      await this.authService.customerRegister(customer);
    return { access_token, user };
  }
  @Post('register/provider')
  @UseInterceptors(
    FileInterceptor('cvFile', {
      storage: multer.memoryStorage(),
    }),
  )
  async registerProvider(
    @Body() providerRegisterDto: ProviderRegisterDto,
    @UploadedFile() cvFile?: Express.Multer.File,
  ) {
    const provider =
      await this.authFactoryService.createProvider(providerRegisterDto);
    const { access_token, user } = await this.authService.providerRegister(
      provider,
      cvFile,
    );

    return { access_token, user };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {
    // redirects to Google login
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    const user = req.user;
    return this.authService.GoogleSignIn(user);
  }

  @Post('confirm-email')
  async confirmEmail(@Body() confirmOTPDto: ConfirmOTPDto) {
    return this.authService.confirmEmail(confirmOTPDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.CUSTOMER)
  @Post('refresh-token')
  async refreshToken(@Request() req: any) {
    const user = req.user;
    return this.authService.refreshToken(user);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOTPDto: ResendOTPDto) {
    return this.authService.resendOTP(resendOTPDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token found');

    return this.authService.logout(token);
  }
}
