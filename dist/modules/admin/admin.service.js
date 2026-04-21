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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const index_1 = require("../../models/index");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
let AdminService = class AdminService {
    adminRepository;
    providerRepository;
    jwtService;
    constructor(adminRepository, providerRepository, jwtService) {
        this.adminRepository = adminRepository;
        this.providerRepository = providerRepository;
        this.jwtService = jwtService;
    }
    async createAdmin(admin) {
        const existingAdmin = await this.adminRepository.findOne({
            email: admin.email,
        });
        if (existingAdmin) {
            throw new common_1.ConflictException('Admin already exists');
        }
        admin.password = await bcrypt.hash(admin.password, 10);
        try {
            await this.adminRepository.create(admin);
            return { message: 'Admin created successfully' };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('Admin email already exists');
            }
            throw error;
        }
    }
    async login(user) {
        const payload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async getPendingProviders() {
        const allProviders = await this.providerRepository.find({});
        console.log('ALL PROVIDERS:', allProviders);
        const pendingProviders = await this.providerRepository.find({
            adminApproved: false,
        });
        return pendingProviders.map((p) => ({
            id: p._id,
            userName: p.userName,
            specialization: p.specialization,
            service: p.service,
            nationalNumber: p.nationalNumber,
            writtenCv: p.writtenCv,
            state: p.state,
            city: p.city,
            email: p.email,
            mobileNumber: p.mobileNumber,
            age: p.age,
            profileURL: p.profileURL,
            backgroundURL: p.backgroundURL,
            cvUrl: p.cvUrl,
        }));
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [index_1.AdminRepository,
        index_1.ProviderRepository,
        jwt_1.JwtService])
], AdminService);
//# sourceMappingURL=admin.service.js.map