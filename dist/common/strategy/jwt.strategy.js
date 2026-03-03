"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const index_1 = require("../../models/index");
const token_repository_1 = require("../../models/token/token.repository");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt') {
    tokenRepository;
    userRepository;
    constructor(configService, tokenRepository, userRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
            passReqToCallback: true,
        });
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }
    async validate(req, payload) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('No token provided');
        }
        const isBlacklisted = await this.tokenRepository.isBlacklisted(token);
        if (isBlacklisted) {
            throw new common_1.UnauthorizedException('Token is blacklisted');
        }
        const user = await this.userRepository.findById(payload._id);
        if (user?.changeCredentialTimestamp && payload.iat * 1000 < user.changeCredentialTimestamp.getTime()) {
            throw new common_1.UnauthorizedException('Token is invalid due to credential change');
        }
        return {
            email: payload.email,
            _id: payload._id,
            role: payload.role,
            userName: payload.userName,
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, token_repository_1.TokenRepository, index_1.UserRepository])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map