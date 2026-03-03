import { CustomerRegisterDto, ProviderRegisterDto } from './dto/register.dto';
import { CustomerRepository, ProviderRepository, UserRepository } from '@models/index';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role, UserAgent } from '@common/types/enum';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
import { TokenRepository } from '@models/token/token.repository';
import { CloudinaryService } from '@common/cloudinary';
export declare class AuthService {
    private readonly userRepository;
    private readonly customerRepository;
    private readonly providerRepository;
    private readonly tokenRepository;
    private readonly configService;
    private readonly jwtService;
    private readonly cloudinaryService;
    constructor(userRepository: UserRepository, customerRepository: CustomerRepository, providerRepository: ProviderRepository, tokenRepository: TokenRepository, configService: ConfigService, jwtService: JwtService, cloudinaryService: CloudinaryService);
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
    validateAdmin(email: string, password: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
        mobileNumber: string;
        otp: string;
        otpExpiry: Date;
        isVerified: boolean;
        role: Role;
        userAgent: UserAgent;
        state: string;
        city: import("@common/types/enum").City;
        dob: Date;
        adminApproved: boolean;
        age: number;
        changeCredentialTimestamp: Date;
        isDeleted: boolean;
        deletedAt: Date;
        profileURL: string;
        profilePublicId: string;
        backgroundURL: string;
        backgroundPublicId: string;
        __v: number;
        id: string;
    } | null>;
}
