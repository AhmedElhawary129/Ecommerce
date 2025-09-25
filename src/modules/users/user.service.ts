import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { sendEmail } from "src/common/utils/sendEmail";
import { Compare, Hash } from "src/common/security/Hash";
import { tokenService } from "src/common/service/token";
import { UserDocument } from "src/DB/models/user.model";
import { OTPRepository, UserRepository } from "src/DB/repository/index";
import { confirmEmailDot, SignUpDot } from "./dto/user.dto";
import { OTPTypes, UserRoles } from "src/common/types/types";

@Injectable()
export class UserService {
  constructor(
    private readonly UserRepository: UserRepository,
    private readonly tokenService: tokenService,
    private readonly OTPRepository: OTPRepository,
  ) {}

  //----------------------------------------------------------------------------------------------------------------

  // sign up
  async signUp(body: SignUpDot) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        DOB,
        phone,
        address,
        gender,
        role,
      } = body;

      const emailExist = await this.UserRepository.findOne({filter: { email }});
      if (emailExist) {
        throw new ConflictException("Email already exist");
      }

      const user = await this.UserRepository.create({
        firstName,
        lastName,
        email,
        password,
        DOB,
        phone,
        address,
        gender,
        role,
      });
      const code = Math.floor(
        100000 + Math.random() * (2003 - 9) + 12,
      ).toString();
      this.OTPRepository.createOtp({
        userId: user._id,
        otp: Hash(code),
        otpType: OTPTypes.emailConfirmation,
      });
      await sendEmail({
        to: email,
        subject: "Confirm your email",
        html: `<h1>Code: ${code}</h1>`,
      });
      return {message: "Account created successfully", user};
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //----------------------------------------------------------------------------------------------------------------

  // confirm email
  async confirmEmail(body: confirmEmailDot) {
    try {
      const { email, otp } = body;

      const user = await this.UserRepository.findOne({
        filter: {
          email,
          confirmed: false,
        }
      });
      if (!user) {
        throw new NotFoundException("User not exist or already confirmed");
      }

      const otpExist = await this.OTPRepository.findOne({
        filter: {
          userId: user._id,
          otpType: OTPTypes.emailConfirmation,
        }
      });
      if (!otpExist) {
        throw new NotFoundException("OTP not exist");
      }

      if (!Compare(otp, otpExist.otp)) {
        throw new ForbiddenException("Invalid OTP");
      }

      if (new Date() > otpExist.expireAt) {
        throw new ForbiddenException("OTP expired");
      }

      await this.UserRepository.findOneAndUpdate(
        { _id: user._id },
        { confirmed: true },
      );
      await this.OTPRepository.findOneAndDelete({ _id: otpExist._id });
      return { message: "Email confirmed successfully" };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //----------------------------------------------------------------------------------------------------------------

  // sign in
  async signIn(body: any): Promise<any> {
    try {
      const { email, password } = body;

      const user = await this.UserRepository.findOne({
        filter: {
          email,
          confirmed: true,
        }
      });
      if (!user) {
        throw new ConflictException("Email not exist or not confirmed yet");
      }
      if (!Compare(password, user.password)) {
        throw new ForbiddenException("Invalid password");
      }

      const access_token = this.tokenService.generateToken(
        { email, id: user["_id"] },
        { secret: process.env.ACCESS_TOKEN_SIGNATURE, expiresIn: "1d" },
      );

      const refresh_token = this.tokenService.generateToken(
        { email, id: user["_id"] },
        { secret: process.env.REFRESH_TOKEN_SIGNATURE, expiresIn: "1w" },
      );

      let prefix = "";
      if (user.role == UserRoles.admin || user.role == UserRoles.superAdmin) {
        prefix = UserRoles.admin;
      } else if (user.role == UserRoles.user) {
        prefix = UserRoles.user;
      }

      return { Tokens: { access_token, refresh_token }, prefix };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //----------------------------------------------------------------------------------------------------------------

  // profile
  async profile(user: UserDocument) {
    try {
      return `Profile of ${user.firstName} ${user.lastName} : ${user}`;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
