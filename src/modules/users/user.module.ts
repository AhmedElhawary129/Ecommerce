import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { tokenService } from "src/common/service/token";
import { JwtService } from "@nestjs/jwt";
import { OTPRepository, UserRepository } from "src/DB/repository/index";
import { OTPModel, UserModel } from "src/DB/models/index";

@Module({
  imports: [UserModel, OTPModel],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    tokenService,
    JwtService,
    OTPRepository,
  ],
})
export class UserModule {}
