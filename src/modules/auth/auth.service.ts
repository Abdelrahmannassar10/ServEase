import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ProviderRegisterDto } from './dto/register.dto';
import {
  CustomerRepository,
  ProviderRepository,
  ServiceRepository,
  UserRepository,
} from '@models/index';
import { generateOTP, sendMail } from '@common/helper';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ProviderStatus, Role, UserAgent } from '@common/types/enum';
import * as bcrypt from 'bcrypt';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
import { TokenRepository } from '@models/token/token.repository';
import { CloudinaryService } from '@common/cloudinary';
import { Customer } from './entities/auth.entity';
import { ForgetPasswordOTPDto } from './dto/forget-passwordOTP';
import { CheckOTPDto } from './dto/checkForgetPasswordOTP';
import { ChangePasswordOTPDto } from './dto/changePasswordOTPDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly serviceRepository: ServiceRepository,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const match = await bcrypt.compare(pass, user.password);

    if (!match) throw new UnauthorizedException('Invalid email or password');
    if (user.isVerified == false) {
      throw new UnauthorizedException('Please verify your email first');
    }

    if (user.role == Role.PROVIDER) {
      if (user.adminApproved === ProviderStatus.PendingApproval) {
        throw new UnauthorizedException(
          'Admin did`t approve for your email yet',
        );
      }
    }

    if (user.isDeleted) {
      user.isDeleted = false;
      await this.userRepository.updateById(user._id as unknown as string, {
        isDeleted: false,
        deletedAt: null,
      });
    }

    return user;
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      _id: user._id,
      role: user.role,
      userName: user.userName,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      role: user.role,
      userName: user.userName,
      email: user.email,
    };
  }
  async customerRegister(customer: Customer) {
    const userExists = await this.userRepository.findOne({
      email: customer.email,
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const customerExist = await this.customerRepository.create(customer);
    const templates = this.configService.get('EMAIL_TEMPLATES');
    sendMail({
      to: customerExist.email,
      subject: templates.customerRegister.subject,
      html: templates.customerRegister.body(customerExist.otp),
    });
    const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
      JSON.stringify(customerExist),
    );
    const payload = {
      email: customerExist.email,
      _id: customerExist._id,
      role: customerExist.role,
      userName: customerExist.userName,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      user: createdObj,
    };
  }
  async providerRegister(
    providerRegisterDTO: ProviderRegisterDto,
    cvFile?: Express.Multer.File,
  ) {
    if (!providerRegisterDTO.writtenCv && !cvFile) {
      throw new BadRequestException(
        'Provider must provide CV text or upload a CV file.',
      );
    }

    const providerExists = await this.userRepository.findOne({
      $or: [
        { email: providerRegisterDTO.email },
        { nationalNumber: providerRegisterDTO.nationalNumber },
      ],
    });

    if (providerExists) {
      throw new ConflictException(
        'User Email or National Number already exists',
      );
    }

    const service = await this.serviceRepository.findById(
      providerRegisterDTO.service as unknown as string,
    );
    if (!service) {
      throw new BadRequestException('Invalid service ID');
    }

    let cvUrl: string | undefined = undefined;
    if (cvFile) {
      const upload = await this.cloudinaryService.uploadPdf(
        cvFile,
        `ServEase/Provider/${providerRegisterDTO.email}/cv`,
      );

      cvUrl = upload.secure_url;
    }

    const provider = await this.providerRepository.create({
      ...providerRegisterDTO,
      writtenCv: providerRegisterDTO.writtenCv || undefined,
      cvUrl,
    });
    const templates = this.configService.get('EMAIL_TEMPLATES');
    sendMail({
      to: provider.email,
      subject: templates.providerRegister.subject,
      html: templates.providerRegister.body(provider.otp),
    });

    const createdProvider = await this.providerRepository.findById(
      provider._id as unknown as string,
      { populate: ['service'], lean: true },
    );
    const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
      JSON.stringify(createdProvider ?? provider),
    );

    const payload = {
      email: provider.email,
      _id: provider._id,
      role: provider.role,
      userName: provider.userName,
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      user: createdObj,
    };
  }
  async GoogleSignIn(user: any) {
    const userExists = await this.userRepository.findOne({
      email: user.email,
    });
    if (userExists) {
      const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
        JSON.stringify(userExists),
      );
      const payload = {
        email: userExists.email,
        _id: userExists._id,
        role: userExists.role,
        userName: userExists.userName,
      };
      return {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        }),
        user: createdObj,
      };
    }
    const newUser = await this.customerRepository.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userAgent: UserAgent.GOOGLE,
      isVerified: true,
      googlePicture: user.picture,
    });
    const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
      JSON.stringify(newUser),
    );
    const payload = {
      email: newUser.email,
      _id: newUser._id,
      role: newUser.role,
      userName: newUser.userName,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
      user: createdObj,
    };
  }
  async confirmEmail(confirmOTPDto: ConfirmOTPDto) {
    const user = await this.userRepository.findOne({
      email: confirmOTPDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (user.isVerified) {
      throw new UnauthorizedException('Email already verified');
    }
    if (user.otp !== confirmOTPDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    await this.userRepository.findOneAndUpdate(
      { email: confirmOTPDto.email },
      { isVerified: true, otp: null, otpExpiry: null },
    );
    return { message: 'Email verified successfully' };
  }
  async refreshToken(user: any) {
    if (user.changeCredentialTimestamp) {
      const lastChanged = new Date(user.changeCredentialTimestamp).getTime();
      const now = Date.now();
      if (now - lastChanged > 24 * 60 * 60 * 1000) {
        throw new UnauthorizedException('Token expired');
      }
    }
    const payload = {
      email: user.email,
      _id: user._id,
      role: user.role,
      userName: user.userName,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '1d',
      }),
    };
  }
  async resendOTP(resendOTPDto: ResendOTPDto) {
    const user = await this.userRepository.findOne({
      email: resendOTPDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (user.isVerified) {
      throw new ConflictException('Email already verified');
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 30 * 1000);
    await this.userRepository.findOneAndUpdate(
      { email: resendOTPDto.email },
      { otp, otpExpiry },
    );
    const templates = this.configService.get('EMAIL_TEMPLATES');
    sendMail({
      to: user.email,
      subject: templates.resendOtp.subject,
      html: templates.resendOtp.body(otp),
    });
    return { message: 'OTP resent successfully' };
  }

  async forgetPassword(forgetPasswordDTO: ForgetPasswordOTPDto) {
    const user = await this.userRepository.findOne({
      email: forgetPasswordDTO.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 90 * 1000);
    await this.userRepository.findOneAndUpdate(
      { email: forgetPasswordDTO.email },
      { otp, otpExpiry },
    );
    const templates = this.configService.get('EMAIL_TEMPLATES');
    sendMail({
      to: user.email,
      subject: templates.forgotPassword.subject,
      html: templates.forgotPassword.body(otp),
    });
    return { message: 'OTP sent to your email' };
  }

  async checkForgetPasswordOTP(checkOTPDto: CheckOTPDto) {
    const user = await this.userRepository.findOne({
      email: checkOTPDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (user.otp !== checkOTPDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    return { message: 'OTP is valid' };
  }

  async changePasswordAfterOTP(changePasswordOTPDto: ChangePasswordOTPDto) {
    const user = await this.userRepository.findOne({
      email: changePasswordOTPDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid email');
    }
    if (user.otp !== changePasswordOTPDto.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }
    const hashedPassword = await bcrypt.hash(
      changePasswordOTPDto.newPassword,
      10,
    );
    await this.userRepository.findOneAndUpdate(
      { email: changePasswordOTPDto.email },
      { password: hashedPassword, otp: null, otpExpiry: null },
    );
    return { message: 'Password changed successfully' };
  } 

  async logout(token: string) {
    await this.tokenRepository.add(
      token,
      new Date(Date.now() + 1000 * 60 * 60),
    );
    return { message: 'Logged out successfully' };
  }
  async validateAdmin(email: string, password: string) {
    const admin = await this.userRepository.findOne({
      email,
      role: Role.ADMIN,
      isDeleted: false,
    });

    if (!admin) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = admin.toObject();
    return result;
  }
}
