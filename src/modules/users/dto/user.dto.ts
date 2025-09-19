import { Transform } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  ValidateIf,
} from "class-validator";
import { customPasswordDecorator } from "src/common/decorator/customPassword.decorator";
import { UserGender, UserRoles } from "src/common/types/types";

export class SignUpDot {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @MinLength(3)
  lastName: string;

  @IsEmail()
  email: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  DOB: Date;

  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  @customPasswordDecorator({
    message: "Password and confirm password not match",
  })
  confirmPassword: string;

  @IsEnum(UserRoles)
  role: string;

  @IsEnum(UserGender)
  gender: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}

//----------------------------------------------------------------------------------------------------------------

export class confirmEmailDot {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
