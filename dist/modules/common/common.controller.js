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
exports.CommonController = void 0;
const common_1 = require("@nestjs/common");
const common_service_1 = require("./common.service");
const platform_express_1 = require("@nestjs/platform-express");
const enum_1 = require("../../common/types/enum");
const decorators_1 = require("../../common/decorators");
const passport_1 = require("@nestjs/passport");
const guard_1 = require("../../common/guard");
const multer = __importStar(require("multer"));
let CommonController = class CommonController {
    commonService;
    constructor(commonService) {
        this.commonService = commonService;
    }
    uploadPhoto(req, photo) {
        if (!photo) {
            throw new common_1.BadRequestException('Missing required file');
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type');
        }
        if (photo.size > 2 * 1024 * 1024) {
            throw new common_1.BadRequestException('File too large. Max 2MB');
        }
        return this.commonService.uploadPhoto(req.user, photo);
    }
    uploadBackGroundPhoto(req, photo) {
        if (!photo) {
            throw new common_1.BadRequestException('Missing required file');
        }
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new common_1.BadRequestException('Invalid file type');
        }
        if (photo.size > 2 * 1024 * 1024) {
            throw new common_1.BadRequestException('File too large. Max 2MB');
        }
        return this.commonService.uploadBackgroundPhoto(req.user, photo);
    }
};
exports.CommonController = CommonController;
__decorate([
    (0, common_1.Post)('upload-photo'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER, enum_1.Role.PROVIDER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: multer.memoryStorage(),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "uploadPhoto", null);
__decorate([
    (0, common_1.Post)('upload-background-photo'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), guard_1.RolesGuard),
    (0, decorators_1.Roles)(enum_1.Role.CUSTOMER, enum_1.Role.PROVIDER),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo', {
        storage: multer.memoryStorage(),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CommonController.prototype, "uploadBackGroundPhoto", null);
exports.CommonController = CommonController = __decorate([
    (0, common_1.Controller)('common'),
    __metadata("design:paramtypes", [common_service_1.CommonService])
], CommonController);
//# sourceMappingURL=common.controller.js.map