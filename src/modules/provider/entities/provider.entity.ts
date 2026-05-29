import { Gender, state } from "@common/types/enum";
import { Types } from "mongoose";

export class Provider {

      firstName: string;
    

      lastName: string;
 
      mobileNumber: string;

      dob: Date;

      city: string;
  
      state: state;
  
      writtenCv: string;

      nationalNumber: string;
    

      service: Types.ObjectId;
  
      specialization: string;
      gender: Gender;
}
