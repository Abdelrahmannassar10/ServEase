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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const register_dto_1 = require("./dto/register.dto");
const factory_1 = require("./factory");
const google_guard_1 = require("../../common/guard/google.guard");
const passport_1 = require("@nestjs/passport");
const confirmOTP_dto_1 = require("./dto/confirmOTP.dto");
const resendOTP_1 = require("./dto/resendOTP");
const decorators_1 = require("../../common/decorators");
const enum_1 = require("../../common/types/enum");
const guard_1 = require("../../common/guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer = __importStar(require("multer"));
let AuthController = class AuthController {
    authService;
    authFactoryService;
    constructor(authService, authFactoryService) {
        this.authService = authService;
        this.authFactoryService = authFactoryService;
    }
    async customerRegister(customerRegisterDto) {
        const customer = await this.authFactoryService.createCustomer(customerRegisterDto);
        const { access_token, user } = await this.authService.customerRegister(customer);
        return { access_token, user };
    }
    async registerProvider(providerRegisterDto, cvFile) {
        const provider = await this.authFactoryService.createProvider(providerRegisterDto);
        const { access_token, user } = await this.authService.providerRegister(provider, cvFile);
        return { access_token, user };
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async googleAuth() {
    }
    googleAuthRedirect(req) {
        const user = req.user;
        return this.authService.GoogleSignIn(user);
    }
    async confirmEmail(confirmOTPDto) {
        return this.authService.confirmEmail(confirmOTPDto);
    }
    async refreshToken(req) {
        const user = req.user;
        return this.authService.refreshToken(user);
    }
    async resendOTP(resendOTPDto) {
        return this.authService.resendOTP(resendOTPDto);
    }
    async logout(req) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            throw new Error('No token found');
        return this.authService.logout(token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register/customer'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.CustomerRegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "customerRegister", null);
__decorate([
    (0, common_1.Post)('register/provider'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('cvFile', {
        storage: multer.memoryStorage(),
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.ProviderRegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerProvider", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(google_guard_1.GoogleAuthGuard),
    (0, common_1.Get)('google'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)(google_guard_1.GoogleAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Post)('confirm-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirmOTP_dto_1.ConfirmOTPDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "confirmEmail", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER),
    (0, common_1.Post)('refresh-token'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resendOTP_1.ResendOTPDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOTP", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        factory_1.AuthFactoryService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map