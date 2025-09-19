import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import {
  CartRepository,
  CouponRepository,
  OrderRepository,
  ProductRepository,
} from "src/DB/repository";
import {
  CartModel,
  CouponModel,
  OrderModel,
  ProductModel,
} from "src/DB/models";
import { PaymentService } from "./service/payment";

@Module({
  imports: [OrderModel, CartModel, CouponModel, ProductModel],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    CartRepository,
    PaymentService,
    CouponRepository,
    ProductRepository,
  ],
  exports: [
    OrderService,
    OrderRepository,
    CartRepository,
    PaymentService,
    CouponRepository,
    ProductRepository,
  ],
})
export class OrderModule {}
