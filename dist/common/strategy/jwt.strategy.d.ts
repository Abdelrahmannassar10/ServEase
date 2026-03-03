import { UserRepository } from '@models/index';
import { TokenRepository } from '@models/token/token.repository';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly tokenRepository;
    private readonly userRepository;
    constructor(configService: ConfigService, tokenRepository: TokenRepository, userRepository: UserRepository);
    validate(req: any, payload: any): Promise<{
        email: any;
        _id: any;
        role: any;
        userName: any;
    }>;
}
export {};
