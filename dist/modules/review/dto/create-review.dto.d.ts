import { Types } from "mongoose";
export declare class globalReviewDto {
    rate: Number;
    content: string;
}
export declare class RequestReviewDto {
    rate: number;
    content: string;
    providerId: Types.ObjectId;
}
