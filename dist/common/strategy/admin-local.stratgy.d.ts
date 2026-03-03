import { Role } from '@common/types/enum';
import { AuthService } from '@modules/auth/auth.service';
import { Strategy } from 'passport-local';
declare const AdminLocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class AdminLocalStrategy extends AdminLocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        firstName: string;
        lastName: string;
        userName: string;
        email: string;
        mobileNumber: string;
        otp: string;
        otpExpiry: Date;
        isVerified: boolean;
        role: Role;
        userAgent: import("@common/types/enum").UserAgent;
        state: string;
        city: import("@common/types/enum").City;
        dob: Date;
        adminApproved: boolean;
        age: number;
        changeCredentialTimestamp: Date;
        isDeleted: boolean;
        deletedAt: Date;
        profileURL: string;
        profilePublicId: string;
        backgroundURL: string;
        backgroundPublicId: string;
        __v: number;
        id: string;
    }>;
}
export {};
