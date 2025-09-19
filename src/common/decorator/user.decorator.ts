import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserDecorator = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        if (context.getType<"graphql">() === "graphql") {
            const gqlCtx = GqlExecutionContext.create(context);
            return gqlCtx.getContext().req?.user;
        } else {
            const req = context.switchToHttp().getRequest();
            return req?.user;
        }
    }
);
