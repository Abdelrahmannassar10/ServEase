import { IsMongoId, IsNumber, IsString, Max, Min } from "class-validator";
import { Types } from "mongoose";

export class globalReviewDto {
    @IsNumber()
    @Max(5)
    @Min(0)
    rate :Number ;

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
