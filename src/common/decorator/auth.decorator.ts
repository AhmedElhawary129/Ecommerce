
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../guards/authentication";
import { RolesGuard } from "../guards/authorization";
import { UserRoles } from "../types/types";
import { ROLES_KEY } from "./role.decorator";

export function Auth(...roles: UserRoles[]) {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(AuthGuard, RolesGuard),
    );
}
