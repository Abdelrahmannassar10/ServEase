import { ReviewType } from "@common/types/enum";
import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema()
export class review {
    readonly id : Types.ObjectId ;
    userId :Types.ObjectId
    customerId :Types.ObjectId ;
    ProviderId :Types.ObjectId ;
    rate:Number ;
    content :string ;
    status :ReviewType ;
}
export const reviewSchema = SchemaFactory.createForClass(review);