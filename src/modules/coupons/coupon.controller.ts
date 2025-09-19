import { Body, Controller, Delete, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CouponService } from "./coupon.service";
import { CreateCouponDto, UpdateCouponDto } from "./dto/coupon.dto";
import { Auth, UserDecorator } from "src/common/decorator";
import type { UserDocument } from "src/DB/models";
import { UserRoles } from "src/common/types/types";
import { Types } from "mongoose";

@Controller("coupons")
export class CouponController {
    constructor(
        private readonly _couponService: CouponService
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    @Post("create")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe())
    async createCoupon(
        @Body() body: CreateCouponDto,
        @UserDecorator() user: UserDocument
    ) {
        return await this._couponService.createCoupon(body, user);
    }


    //----------------------------------------------------------------------------------------------------------------

    // update coupon
    @Patch("update/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe())
    async updateCoupon(
        @Body() body: UpdateCouponDto,
        @UserDecorator() user: UserDocument,
        @Param("id") id: Types.ObjectId
    ) {
        return await this._couponService.updateCoupon(body, user, id);
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete coupon
    @Delete("delete/:id")
    @Auth(UserRoles.admin)
    @UsePipes(new ValidationPipe())
    async deleteCoupon(
        @UserDecorator() user: UserDocument,
        @Param("id") id: Types.ObjectId
    ) {
        return await this._couponService.deleteCoupon(user, id);
    }
}
