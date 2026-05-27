import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class updatePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @Length(8, 80, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain at least one letter and one number',
  })
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 80, { message: 'password must be at least 8 characters long' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'password must contain at least one letter and one number',
  })
  newPassword: string;
}
