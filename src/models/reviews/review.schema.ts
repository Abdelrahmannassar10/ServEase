import { ReviewType } from "@common/types/enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Review {
    readonly id: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: "User" ,default:undefined   })
    userId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: "Customer" ,default:undefined   })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Provider" ,default:undefined   })

    ProviderId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "Request" ,default:undefined   })
    requestId: Types.ObjectId;

    @Prop({type:Number , maxLength:5 ,minlength:1,required:true})
    rate: Number;

    @Prop({type :String ,required:true})
    content: string;

    @Prop({type :String ,enum:ReviewType,required:true})
    status: ReviewType;
}
export const reviewSchema = SchemaFactory.createForClass(Review);