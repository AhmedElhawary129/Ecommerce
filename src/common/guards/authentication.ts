import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { tokenService } from "../service/token";
import { UserRepository } from "src/DB/repository/user.repository";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepository: UserRepository,
    private TokenService: tokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    if (context.getType<"http">() === "http") {
      const request = context.switchToHttp().getRequest<Request>();

      if (!request.headers.authorization) {
        throw new UnauthorizedException("Token not found");
      }

      const token = request.headers.authorization?.split(" ")[1] ?? [];
      if (!token) {
        throw new UnauthorizedException("Invalid token");
      }
      try {
        const payload = await this.TokenService.verifyToken(token, {
          secret: process.env.ACCESS_TOKEN_SIGNATURE,
        });
        const user = await this.userRepository.findById(payload.id);
        if (!user) {
          throw new ForbiddenException("User not found");
        }
        request["user"] = user;
      } catch {
        throw new UnauthorizedException("Something wrong or token expired");
      }
    } else if (context.getType<"graphql">() === "graphql") {
      const request = GqlExecutionContext.create(context).getContext();
      if (!request.req.headers.authorization) {
        throw new UnauthorizedException("Token not found");
      }

      const token = request.req.headers.authorization?.split(" ")[1] ?? [];
      if (!token) {
        throw new UnauthorizedException("Invalid token");
      }
      try {
        const payload = await this.TokenService.verifyToken(token, {
          secret: process.env.ACCESS_TOKEN_SIGNATURE,
        });
        const user = await this.userRepository.findById(payload.id);
        if (!user) {
          throw new ForbiddenException("User not found");
        }
        request.req["user"] = user;
      } catch {
        throw new UnauthorizedException("Something wrong or token expired");
      }
    }
    return true;
  }
}
