import { Body, Controller, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddToCartDto, RemoveFromCartDto, UpdateQuantityDto } from "./dto/cart.dto";
import { Auth, UserDecorator } from "src/common/decorator";
import type { UserDocument } from "src/DB/models";
import { UserRoles } from "src/common/types/types";

@Controller("carts")
export class CartController {
    constructor(private readonly _cartService: CartService) {}

    //----------------------------------------------------------------------------------------------------------------

    // add to cart
    @Post("add")
    @Auth(UserRoles.user, UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async addToCart(
        @Body() body: AddToCartDto, 
        @UserDecorator() user: UserDocument
    ) {
        return await this._cartService.addToCart(body, user);
    }

    //----------------------------------------------------------------------------------------------------------------

    // remove from cart
    @Patch("remove")
    @Auth(UserRoles.user, UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async removeFromCart(
        @Body() body: RemoveFromCartDto, 
        @UserDecorator() user: UserDocument
    ) {
        return await this._cartService.removeFromCart(body, user);
    }

    //----------------------------------------------------------------------------------------------------------------

    // update quantity of product in cart
    @Patch("update")
    @Auth(UserRoles.user, UserRoles.admin)
    @UsePipes(new ValidationPipe({}))
    async updatQuantity(
        @Body() body: UpdateQuantityDto, 
        @UserDecorator() user: UserDocument
    ) {
        return await this._cartService.updatQuantity(body, user);
    }
}
