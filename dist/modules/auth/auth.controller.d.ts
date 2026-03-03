import { AuthService } from './auth.service';
import { CustomerRegisterDto, ProviderRegisterDto } from './dto/register.dto';
import { AuthFactoryService } from './factory';
import { ConfirmOTPDto } from './dto/confirmOTP.dto';
import { ResendOTPDto } from './dto/resendOTP';
export declare class AuthController {
    private readonly authService;
    private readonly authFactoryService;
    constructor(authService: AuthService, authFactoryService: AuthFactoryService);
    register(customerRegisterDto: CustomerRegisterDto): Promise<{
        access_token: string;
        user: any;
    }>;
    registerProvider(providerRegisterDto: ProviderRegisterDto, cvFile?: Express.Multer.File): Promise<{
        access_token: string;
        user: any;
    }>;
    login(req: any): Promise<{
        access_token: string;
        role: any;
        userName: any;
        email: any;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: any): Promise<{
        access_token: string;
        user: any;
    }>;
    confirmEmail(confirmOTPDto: ConfirmOTPDto): Promise<{
        message: string;
    }>;
    refreshToken(req: any): Promise<{
        access_token: string;
    }>;
    resendOTP(resendOTPDto: ResendOTPDto): Promise<{
        message: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
}
