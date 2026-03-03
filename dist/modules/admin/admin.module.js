"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
const modules_1 = require("../../shared/modules");
const factory_1 = require("./factory");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const admin_local_stratgy_1 = require("../../common/strategy/admin-local.stratgy");
const auth_module_1 = require("../auth/auth.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            modules_1.UserMongooseModule,
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
            auth_module_1.AuthModule
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService, factory_1.AdminFactoryService, admin_local_stratgy_1.AdminLocalStrategy],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map