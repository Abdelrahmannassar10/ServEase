import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsMongoId()
    categoryId: mongoose.Types.ObjectId;
}
