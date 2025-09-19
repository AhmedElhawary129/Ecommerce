import { Module } from "@nestjs/common";
import { CouponController } from "./coupon.controller";
import { CouponService } from "./coupon.service";
import { CouponModel } from "src/DB/models";
import { CouponRepository } from "src/DB/repository";

@Module({
  imports: [CouponModel],
  controllers: [CouponController],
  providers: [CouponService, CouponRepository],
})
export class CouponModule {}
