"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../models/index");
const helper_1 = require("../../common/helper");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const enum_1 = require("../../common/types/enum");
const bcrypt = __importStar(require("bcrypt"));
const token_repository_1 = require("../../models/token/token.repository");
const cloudinary_1 = require("../../common/cloudinary");
let AuthService = class AuthService {
    userRepository;
    customerRepository;
    providerRepository;
    tokenRepository;
    configService;
    jwtService;
    cloudinaryService;
    constructor(userRepository, customerRepository, providerRepository, tokenRepository, configService, jwtService, cloudinaryService) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.providerRepository = providerRepository;
        this.tokenRepository = tokenRepository;
        this.configService = configService;
        this.jwtService = jwtService;
        this.cloudinaryService = cloudinaryService;
    }
    async validateUser(email, pass) {
        const user = await this.userRepository.findOne({ email });
        if (!user)
            throw new common_1.UnauthorizedException("Invalid email or password");
        const match = await bcrypt.compare(pass, user.password);
        if (!match)
            throw new common_1.UnauthorizedException("Invalid email or password");
        if (user.isVerified == false) {
            throw new common_1.UnauthorizedException('Please verify your email first');
        }
        return user;
    }
    async login(user) {
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
    async customerRegister(customerRegisterDTO) {
        const userExists = await this.userRepository.findOne({
            email: customerRegisterDTO.email,
        });
        if (userExists) {
            throw new common_1.ConflictException('User already exists');
        }
        const customer = await this.customerRepository.create(customerRegisterDTO);
        (0, helper_1.sendMail)({
            to: customer.email,
            subject: 'Confirmation Email',
            html: this.configService.get('OTP_Body').body(customer.otp),
        });
        const { password, otp, otpExpiry, ...createdObj } = JSON.parse(JSON.stringify(customer));
        const payload = {
            email: customer.email,
            _id: customer._id,
            role: customer.role,
            userName: customer.userName,
        };
        return {
            access_token: this.jwtService.sign({ payload }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            }),
            user: createdObj,
        };
    }
    async providerRegister(providerRegisterDTO, cvFile) {
        if (!providerRegisterDTO.writtenCv && !cvFile) {
            throw new common_1.BadRequestException('Provider must provide CV text or upload a CV file.');
        }
        const providerExists = await this.userRepository.findOne({
            email: providerRegisterDTO.email,
        });
        if (providerExists) {
            throw new common_1.ConflictException('User already exists');
        }
        let cvUrl = undefined;
        if (cvFile) {
            const upload = await this.cloudinaryService.uploadPdf(cvFile, `ServEase/Provider/${providerRegisterDTO.email}/cv`);
            cvUrl = upload.secure_url;
        }
        const provider = await this.providerRepository.create({
            ...providerRegisterDTO,
            writtenCv: providerRegisterDTO.writtenCv || undefined,
            cvUrl,
        });
        (0, helper_1.sendMail)({
            to: provider.email,
            subject: 'Confirmation Email',
            html: this.configService.get('OTP_Body').body(provider.otp),
        });
        const { password, otp, otpExpiry, ...createdObj } = JSON.parse(JSON.stringify(provider));
        const payload = {
            email: provider.email,
            _id: provider._id,
            role: provider.role,
            userName: provider.userName,
        };
        return {
            access_token: this.jwtService.sign({ payload }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            }),
            user: createdObj,
        };
    }
    async GoogleSignIn(user) {
        const userExists = await this.userRepository.findOne({
            email: user.email,
        });
        if (userExists) {
            const { password, otp, otpExpiry, ...createdObj } = JSON.parse(JSON.stringify(userExists));
            const payload = {
                email: userExists.email,
                _id: userExists._id,
                role: userExists.role,
                userName: userExists.userName,
            };
            return {
                access_token: this.jwtService.sign({ payload }, {
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
            userAgent: enum_1.UserAgent.GOOGLE,
            isVerified: true,
            googlePicture: user.picture,
        });
        const { password, otp, otpExpiry, ...createdObj } = JSON.parse(JSON.stringify(newUser));
        const payload = {
            email: newUser.email,
            _id: newUser._id,
            role: newUser.role,
            userName: newUser.userName,
        };
        return {
            access_token: this.jwtService.sign({ payload }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            }),
            user: createdObj,
        };
    }
    async confirmEmail(confirmOTPDto) {
        const user = await this.userRepository.findOne({
            email: confirmOTPDto.email,
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email');
        }
        if (user.isVerified) {
            throw new common_1.UnauthorizedException('Email already verified');
        }
        if (user.otp !== confirmOTPDto.otp) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        await this.userRepository.findOneAndUpdate({ email: confirmOTPDto.email }, { isVerified: true, otp: null, otpExpiry: null });
        return { message: 'Email verified successfully' };
    }
    async refreshToken(user) {
        if (user.changeCredentialTimestamp) {
            const lastChanged = new Date(user.changeCredentialTimestamp).getTime();
            const now = Date.now();
            if (now - lastChanged > 24 * 60 * 60 * 1000) {
                throw new common_1.UnauthorizedException('Token expired');
            }
        }
        const payload = {
            email: user.email,
            _id: user._id,
            role: user.role,
            userName: user.userName,
        };
        return {
            access_token: this.jwtService.sign({ payload }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: '1d',
            }),
        };
    }
    async resendOTP(resendOTPDto) {
        const user = await this.userRepository.findOne({
            email: resendOTPDto.email,
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email');
        }
        if (user.isVerified) {
            throw new common_1.ConflictException('Email already verified');
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date(Date.now() + 30 * 1000);
        await this.userRepository.findOneAndUpdate({ email: resendOTPDto.email }, { otp, otpExpiry });
        (0, helper_1.sendMail)({
            to: user.email,
            subject: 'Resend OTP',
            html: this.configService.get('OTP_Body').body(otp),
        });
        return { message: 'OTP resent successfully' };
    }
    async logout(token) {
        await this.tokenRepository.add(token, new Date(Date.now() + 1000 * 60 * 60));
        return { message: 'Logged out successfully' };
    }
    async validateAdmin(email, password) {
        const admin = await this.userRepository.findOne({
            email,
            role: enum_1.Role.ADMIN,
            isDeleted: false,
        });
        console.log(admin);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.UserRepository,
        index_1.CustomerRepository,
        index_1.ProviderRepository,
        token_repository_1.TokenRepository,
        config_1.ConfigService,
        jwt_1.JwtService,
        cloudinary_1.CloudinaryService])
], AuthService);
//# sourceMappingURL=auth.service.js.map