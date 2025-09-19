import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { confirmEmailDot, SignUpDot } from "./dto/user.dto";
import { UserRoles } from "src/common/types/types";
import { UserDecorator } from "src/common/decorator/user.decorator";
import type { UserDocument } from "src/DB/models/index";
import { Auth } from "src/common/decorator/auth.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  //----------------------------------------------------------------------------------------------------------------

  @Post("signUp")
  @UsePipes(new ValidationPipe())
  signUp(@Body() body: SignUpDot): any {
    return this._userService.signUp(body);
  }

  //----------------------------------------------------------------------------------------------------------------

  @Patch("confirmEmail")
  @UsePipes(new ValidationPipe())
  confirmEmail(@Body() body: confirmEmailDot): any {
    return this._userService.confirmEmail(body);
  }

  //----------------------------------------------------------------------------------------------------------------

  @Post("signIn")
  @HttpCode(200)
  signIn(@Body() body: SignUpDot): Promise<UserDocument> {
    return this._userService.signIn(body);
  }

  //----------------------------------------------------------------------------------------------------------------

  @Auth(UserRoles.admin, UserRoles.user)
  @Get("profile")
  @HttpCode(200)
  profile(@UserDecorator() user: UserDocument): any {
    return this._userService.profile(user);
  }
}
