import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class RejectProviderDto {

    @IsMongoId()
    @IsNotEmpty()
  providerId: string;

    @IsNotEmpty()
    @IsString()
  cause: string;  
}