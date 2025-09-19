import { Query, Resolver } from "@nestjs/graphql";
import { Auth, UserDecorator } from "src/common/decorator";
import type { UserDocument } from "src/DB/models";
import { OrderService } from "src/modules/orders/order.service";
import { OrderType } from "../types/order.types";
import { UserRoles } from "src/common/types/types";


@Auth(UserRoles.admin, UserRoles.user)
@Resolver()
export class OrderResolver {
    constructor(
        private readonly _orderService: OrderService
    ) { }

    @Query(() => [OrderType], {name: "listOrders", description: "list of orders"})
    async listOrders(
        @UserDecorator() user: UserDocument
    ) {
        return await this._orderService.getAllOrders(user);
    }
}