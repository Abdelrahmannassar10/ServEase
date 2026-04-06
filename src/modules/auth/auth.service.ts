import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerRegisterDto, ProviderRegisterDto } from './dto/register.dto';
import {
  AdminRepository,
  CustomerRepository,
  ProviderRepository,
  UserRepository,
} from '@models/index';
import { sendMail } from '@common/helper';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, UserAgent } from '@common/types/enum';
import * as bcrypt from 'bcrypt';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
import { TokenRepository } from '@models/token/token.repository';
import { CloudinaryService } from '@common/cloudinary';
import { log } from 'console';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly providerRepository: ProviderRepository,
    // private readonly adminRepository: AdminRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async validateUser(email: string, pass: string) {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new UnauthorizedException("Invalid email or password");

    const match = await bcrypt.compare(pass, user.password);

    if (!match) throw new UnauthorizedException("Invalid email or password");
    if (user.isVerified == false) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // if (user.role == Role.PROVIDER) {
    //   if (user.adminApproved == false) {
    //     throw new UnauthorizedException(
    //       'Admin did`t approve for your email yet',
    //     );
    //   }
    // }

    return user;
  }
  async login(user: any) {
    const payload = {
      email: user.email,
      _id: user._id,
      role: user.role,
      userName: user.userName,
    };
    console.log(this.configService.get('JWT_SECRET'));

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
  async customerRegister(customerRegisterDTO: CustomerRegisterDto) {
    const userExists = await this.userRepository.findOne({
      email: customerRegisterDTO.email,
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const customer = await this.customerRepository.create(customerRegisterDTO);
    sendMail({
      to: customer.email,
      subject: 'Confirmation Email',
      html: this.configService.get('OTP_Body').body(customer.otp),
    });
    const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
      JSON.stringify(customer),
    );
    const payload = {
      email: customer.email,
      _id: customer._id,
      role: customer.role,
      userName: customer.userName,
    };
    return {
      access_token: this.jwtService.sign(
        { payload },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      ),
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
      email: providerRegisterDTO.email,
    });

    if (providerExists) {
      throw new ConflictException('User already exists');
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

    sendMail({
      to: provider.email,
      subject: 'Confirmation Email',
      html: this.configService.get('OTP_Body').body(provider.otp),
    });

    const { password, otp, otpExpiry, ...createdObj } = JSON.parse(
      JSON.stringify(provider),
    );

    const payload = {
      email: provider.email,
      _id: provider._id,
      role: provider.role,
      userName: provider.userName,
    };

    return {
      access_token: this.jwtService.sign(
        { payload },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      ),
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
        access_token: this.jwtService.sign(
          { payload },
          {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '1d',
          },
        ),
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
      access_token: this.jwtService.sign(
        { payload },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      ),
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
      access_token: this.jwtService.sign(
        { payload },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '1d',
        },
      ),
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
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 30 * 1000);
    await this.userRepository.findOneAndUpdate(
      { email: resendOTPDto.email },
      { otp, otpExpiry },
    );
    sendMail({
      to: user.email,
      subject: 'Resend OTP',
      html: this.configService.get('OTP_Body').body(otp),
    });
    return { message: 'OTP resent successfully' };
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

  console.log(admin);
  
  if (!admin) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    admin.password,
  );

  if (!isPasswordValid) {
    return null;
  }

  const { password: _, ...result } = admin.toObject();
  return result;
}
}
