import { IsMongoId, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class globalReviewDto {
    @IsNumber()
    @Max(5)
    @Min(0)
    rate :number ;

    @IsMongoId()
    userId :Types.ObjectId ;

    @IsString()
    content :string ;
}

export class RequestReviewDto {
    @IsNumber()
    @Max(5)
    @Min(0)
    rate :number ;

    @IsString()
    content :string ;

    @IsMongoId()
    providerId :Types.ObjectId ;
}
