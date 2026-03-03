"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const modules_1 = require("../../shared/modules");
const factory_1 = require("./factory");
const passport_1 = require("@nestjs/passport");
const google_strategy_1 = require("../../common/strategy/google.strategy");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const strategy_1 = require("../../common/strategy");
const jwt_strategy_1 = require("../../common/strategy/jwt.strategy");
const mongoose_1 = require("@nestjs/mongoose");
const token_schema_1 = require("../../models/token/token.schema");
const token_repository_1 = require("../../models/token/token.repository");
const cloudinary_1 = require("../../common/cloudinary");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            modules_1.UserMongooseModule,
            passport_1.PassportModule.register({ session: false }),
            jwt_1.JwtModule.registerAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                    signOptions: { expiresIn: '1d' },
                }),
            }),
            mongoose_1.MongooseModule.forFeature([{ name: token_schema_1.BlacklistToken.name, schema: token_schema_1.BlacklistTokenSchema }]),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            factory_1.AuthFactoryService,
            google_strategy_1.GoogleStrategy,
            strategy_1.LocalStrategy,
            jwt_strategy_1.JwtStrategy,
            token_repository_1.TokenRepository,
            cloudinary_1.CloudinaryService
        ],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map