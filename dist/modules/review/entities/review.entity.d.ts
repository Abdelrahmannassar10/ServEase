import { ReviewType } from '@common/types/enum';
import { Types } from 'mongoose';
export declare class Review {
    readonly id: Types.ObjectId;
    userId: Types.ObjectId;
    customerId: Types.ObjectId;
    ProviderId: Types.ObjectId;
    rate: Number;
    content: string;
    status: ReviewType;
}
