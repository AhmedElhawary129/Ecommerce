import { Module, Global } from "@nestjs/common";
import { UserModel } from "./DB/models";
import { UserRepository } from "./DB/repository";
import { tokenService } from "./common/service/token";
import { JwtService } from "@nestjs/jwt";


@Global()
@Module({
    imports: [UserModel],
    controllers: [],
    providers: [UserRepository, tokenService, JwtService],
    exports: [UserModel, UserRepository, tokenService, JwtService],
})
export class GlobalModule {}
