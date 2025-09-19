import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRoles } from "../types/types";
import { ROLES_KEY } from "../decorator/role.decorator";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles || requiredRoles.length === 0) {
            throw new BadRequestException("Roles must be specified")
        }

        let user: any;
        if (context.getType<"graphql">() == "graphql") {
            const gqlContext = GqlExecutionContext.create(context);
            user = gqlContext.getContext().req?.user;
        }else {
            const req = context.switchToHttp().getRequest();
            user = req?.user;
        }
        if (!user) {
            throw new BadRequestException("User not found in request")
        }

        if (!requiredRoles.includes(user.role)) {
            throw new BadRequestException("Unauthorized")
        }
        return true;
    }
}