import { CustomerRegisterDto, ProviderRegisterDto } from './dto/register.dto';
import { AdminRepository, CustomerRepository, ProviderRepository, UserRepository } from '@models/index';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
import { TokenRepository } from '@models/token/token.repository';
import { CloudinaryService } from '@common/cloudinary';
export declare class AuthService {
    private readonly userRepository;
    private readonly customerRepository;
    private readonly providerRepository;
    private readonly adminRepository;
    private readonly tokenRepository;
    private readonly configService;
    private readonly jwtService;
    private readonly cloudinaryService;
    constructor(userRepository: UserRepository, customerRepository: CustomerRepository, providerRepository: ProviderRepository, adminRepository: AdminRepository, tokenRepository: TokenRepository, configService: ConfigService, jwtService: JwtService, cloudinaryService: CloudinaryService);
    validateUser(email: string, pass: string): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("@models/index").User, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("@models/index").User, {}, import("mongoose").DefaultSchemaOptions> & import("@models/index").User & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    login(user: any): Promise<{
        access_token: string;
        role: any;
        userName: any;
        email: any;
    }>;
    customerRegister(customerRegisterDTO: CustomerRegisterDto): Promise<{
        access_token: string;
        user: any;
    }>;
    providerRegister(providerRegisterDTO: ProviderRegisterDto, cvFile?: Express.Multer.File): Promise<{
        access_token: string;
        user: any;
    }>;
    GoogleSignIn(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    confirmEmail(confirmOTPDto: ConfirmOTPDto): Promise<{
        message: string;
    }>;
    refreshToken(user: any): Promise<{
        access_token: string;
    }>;
    resendOTP(resendOTPDto: ResendOTPDto): Promise<{
        message: string;
    }>;
    logout(token: string): Promise<{
        message: string;
    }>;
}
