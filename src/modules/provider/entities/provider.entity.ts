import { Gender, ServiceCategory, state } from "@common/types/enum";

export class Provider {

      firstName: string;
    

      lastName: string;
 
      mobileNumber: string;

      dob: Date;

      city: string;
  
      state: state;
  
      writtenCv: string;

      nationalNumber: string;
    

      service: ServiceCategory;
  
      specialization: string;
      gender: Gender;
}
