import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


@Schema()
export class GeneralSetting{
    readonly _id: string;


    @Prop({type: Number})
    webCommission: number;


    @Prop({type: Number})
    providerDebt: number;
}

export const generalSettingSchema = SchemaFactory.createForClass(GeneralSetting);
export type GeneralSettingDocument = HydratedDocument<GeneralSetting>;