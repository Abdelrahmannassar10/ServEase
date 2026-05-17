import { IsMongoId } from "class-validator";

export class getAnotherProfileDTO {
    @IsMongoId()
    id: string;
}