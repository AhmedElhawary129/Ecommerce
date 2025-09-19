import { Body, Controller, Get, HttpCode, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { OrderService } from "./order.service";
import { Auth, UserDecorator } from "src/common/decorator";
import { UserRoles } from "src/common/types/types";
import type { UserDocument } from "src/DB/models";
import { CreateOrderDto } from "./dto/order.dto";
import { Types } from "mongoose";

@Controller("orders")
export class OrderController {
    constructor(private readonly _orderService: OrderService) {}

    //----------------------------------------------------------------------------------------------------------------

    // create order
    @Post("create")
    @Auth(UserRoles.user, UserRoles.admin, UserRoles.superAdmin)
    @UsePipes(new ValidationPipe({}))
    async createOrder(
        @Body() body: CreateOrderDto,
        @UserDecorator() user: UserDocument
    ) {
        return this._orderService.createOrder(body, user);
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment with stripe
    @Post("payment")
    @Auth(UserRoles.user, UserRoles.admin, UserRoles.superAdmin)
    @UsePipes(new ValidationPipe({}))
    async paymentWithStripe(
        @Body("orderId") orderId: string,
        @UserDecorator() user: UserDocument,
    ) {
        return this._orderService.paymentWithStripe(orderId, user);
    }

    //----------------------------------------------------------------------------------------------------------------

    // webbook
    @Post("webhook")
    @HttpCode(200)
    async webhookService(@Body() data: any) {
        return this._orderService.webhookService(data);
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment success
    @Get("success")
    async paymentSuccess() {
        return this._orderService.paymentSuccess();
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment cancelled
    @Get("cancel")
    async paymentCancel() {
        return this._orderService.paymentCancel();
    }

    //----------------------------------------------------------------------------------------------------------------

    // cancel order
    @Patch("cancel")
    @Auth(UserRoles.user, UserRoles.admin, UserRoles.superAdmin)
    @UsePipes(new ValidationPipe({}))
    async cancelOrder(
        @Body("orderId") orderId: Types.ObjectId,
        @UserDecorator() user: UserDocument
    ) {
        return this._orderService.cancelOrder(orderId, user);
    }
}
