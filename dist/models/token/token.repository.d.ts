import { Model } from 'mongoose';
import { AbstractRepository } from '../abstract.repository';
import { HTokenDocument, BlacklistToken } from './token.schema';
export declare class TokenRepository extends AbstractRepository<HTokenDocument> {
    private readonly tokenModel;
    constructor(tokenModel: Model<HTokenDocument>);
    isBlacklisted(token: string): Promise<boolean>;
    add(token: string, expiresAt: Date): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, BlacklistToken, {}, import("mongoose").DefaultSchemaOptions> & BlacklistToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, BlacklistToken, {}, import("mongoose").DefaultSchemaOptions> & BlacklistToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
