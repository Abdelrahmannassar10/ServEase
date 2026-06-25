import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Req,
  UseInterceptors,
  UploadedFiles,
  Response,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthFactoryService } from './factory';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorators';
import { Role } from '@common/types/enum';
import { GoogleAuthGuard, RolesGuard } from '@common/guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import {
  ChangePasswordOTPDto,
  CheckOTPDto,
  ConfirmOTPDto,
  CustomerRegisterDto,
  ForgetPasswordOTPDto,
  ProviderRegisterDto,
  ResendOTPDto,
} from './dto';

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
    FileFieldsInterceptor([
      { name: 'cvFile', maxCount: 1 },
      { name: 'idCardFrontFile', maxCount: 1 },
      { name: 'idCardBackFile', maxCount: 1 },
    ], {
      storage: multer.memoryStorage(),
    }),
  )
  async registerProvider(
    @Body() providerRegisterDto: ProviderRegisterDto,
    @UploadedFiles()
    files?: {
      cvFile?: Express.Multer.File[];
      idCardFrontFile?: Express.Multer.File[];
      idCardBackFile?: Express.Multer.File[];
    },
  ) {
    const provider =
      await this.authFactoryService.createProvider(providerRegisterDto);
    const { access_token, user } = await this.authService.providerRegister(
      provider,
      files?.cvFile?.[0],
      files?.idCardFrontFile?.[0],
      files?.idCardBackFile?.[0],
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
  @Roles(Role.CUSTOMER ,Role.PROVIDER, Role.ADMIN)
  @Post('refresh-token')
  async refreshToken(@Request() req: any) {
    const user = req.user;
    return this.authService.refreshToken(user);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOTPDto: ResendOTPDto) {
    return this.authService.resendOTP(resendOTPDto);
  }

  @Post('forget-passwordOTP')
  async forgetPassword(@Body() forgetPasswordDTO: ForgetPasswordOTPDto) {
    return await this.authService.forgetPassword(forgetPasswordDTO);
  }

  @Post('check-forget-password-otp')
  async checkForgetPasswordOTP(@Body() checkOTPDto: CheckOTPDto) {
    return await this.authService.checkForgetPasswordOTP(checkOTPDto);
  }

  @Post('change-password-after-otp')
  async changePasswordAfterOTP(
    @Body() changePasswordOTPDto: ChangePasswordOTPDto,
  ) {
    return await this.authService.changePasswordAfterOTP(changePasswordOTPDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('No token found');

    return this.authService.logout(token);
  }
}
