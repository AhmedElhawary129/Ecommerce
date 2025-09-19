import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CartRepository, CouponRepository, OrderRepository, ProductRepository } from "src/DB/repository";
import { CreateOrderDto } from "./dto/order.dto";
import type { UserDocument } from "src/DB/models";
import { OrderStatusTypes, PaymentMethodTypes } from "src/common/types/types";
import { PaymentService } from "./service/payment";
import { Types } from "mongoose";

@Injectable()
export class OrderService {
    constructor(
        private readonly _orderRepository: OrderRepository,
        private readonly _cartRepository: CartRepository,
        private readonly _paymentService: PaymentService,
        private readonly _couponRepository: CouponRepository,
        private readonly _productRepository: ProductRepository
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // create order
    async createOrder(body: CreateOrderDto, user: UserDocument) {
        const { phone, address, paymentMethod, couponCode } = body;

        const cart = await this._cartRepository.findOne({filter: {userId: user._id}});
        if (!cart || cart.products.length == 0) {
            throw new NotFoundException("Cart not found or empty");
        }

        const order = await this._orderRepository.create({
            userId: user._id,
            cartId: cart._id,
            phone,
            address,
            totalPrice: cart.subTotal,
            paymentMethod,
            status: paymentMethod == PaymentMethodTypes.cash ? OrderStatusTypes.placed : OrderStatusTypes.pending
        });

        if (paymentMethod == PaymentMethodTypes.cash) {

            // add coupon in cash case
            if (couponCode) {
                const coupon = await this._couponRepository.findOne({ filter: {code: couponCode}});
                if (!coupon) {
                    throw new NotFoundException("Coupon not found");
                }
            if (coupon.usedBy.includes(user._id)) {
                throw new BadRequestException("You have already used this coupon before");
            }
            await this._couponRepository.findOneAndUpdate(
                { code: couponCode },
                { $push: { usedBy: user._id}} as any
            );
            order.couponId = coupon._id
            await order.save();
            }

            // decrease stock of products in cart
            for (const prod of cart.products) {
                console.log({prod, products: cart.products});
                
                const product = await this._productRepository.findOneAndUpdate({_id: prod.productId}, 
                    {$inc: {stock: -prod.quantity}} as any
                );
                if (!product) {
                    throw new NotFoundException("Product not found");
                }
            }
            
            // clear cart products
            cart.products = [];
            await cart.save();
        }

        // add coupon in card case
        if (couponCode) {
            const coupon = await this._couponRepository.findOne({ filter: {code: couponCode}});
            if (!coupon) {
                throw new NotFoundException("Coupon not found");
            }
            order.couponId = coupon._id
            await order.save();
        }
        return {
            message: "Order created successfully", order
        }
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment with stripe
    async paymentWithStripe(orderId: string, user: UserDocument) {
        const order = await this._orderRepository.findOne({
            filter: {
                _id: orderId,
                userId: user._id,
                status: OrderStatusTypes.pending
            },
            populate: [
                {path: "cartId", 
                    populate: [
                        {path: "products.productId"}
                    ]
                },
                {path: "couponId"}
            ]
        });
        if (!order) {
            throw new NotFoundException("Order not found");
        }

        let discounts: any[] = [];
        if (order.couponId) {
            const couponExists = await this._couponRepository.findOne({filter: {_id: order.couponId}});
            if (!couponExists) {
                throw new NotFoundException("Coupon not found");
            }
            if (couponExists?.usedBy.includes(user._id)) {
                throw new BadRequestException("You have already used this coupon before")
            }
            await this._orderRepository.findOneAndUpdate({_id: orderId}, {couponId: couponExists._id});
            const coupon = await this._paymentService.createCoupon({percent_off: couponExists.amount});
            discounts.push({coupon: coupon.id});
        }

        const session = await this._paymentService.createCheckoutSession({
            customer_email: user.email,
            metadata: {orderId: order._id.toString()},
            line_items: order.cartId["products"].map(product => ({
                price_data: {
                    currency: "egp",
                    product_data: {
                        name: product.productId.name,
                        images: [product.productId.mainImage.secure_url],
                    },
                    unit_amount: product.productId.subPrice * 100
                },
                quantity: product.quantity
            })),
            discounts: discounts
        })

        return {
            url: session.url
        }
    }

    //----------------------------------------------------------------------------------------------------------------

    // webhook
    async webhookService(data: any) {
        const orderId  = data.data.object.metadata.orderId;
        const order = await this._orderRepository.findOneAndUpdate(
            {_id: orderId}, {
                status: OrderStatusTypes.paid, 
                orderChanges: {
                    paidAt: new Date()
                },
                paymentIntent: data.data.object.payment_intent
            }
        );
        if (!order) {
            throw new NotFoundException("Order not found or already something went wrong with payment");
        }

        const cart = await this._cartRepository.findOne({
            filter: {_id: order.cartId},
            populate: [
                {path: "userId"}
            ]
        });
        if (!cart) {
            throw new NotFoundException("Cart not found");
        }

        if (order.couponId) {
            const coupon = await this._couponRepository.findOne({filter: {_id: order.couponId}});
            if (!coupon) {
                throw new NotFoundException("Coupon not found");
            }
            if (coupon.usedBy.includes(cart.userId._id)) {
                throw new BadRequestException("You have already used this coupon");
            }
            await this._couponRepository.findOneAndUpdate(
                { _id: order.couponId },
                { $push: { usedBy: cart.userId._id}} as any
            )
        }

        // decrease stock of products in cart
        for (const prod of cart.products) {
            console.log({prod, products: cart.products});
                
            const product = await this._productRepository.findOneAndUpdate({_id: prod.productId}, 
                {$inc: {stock: -prod.quantity}} as any
            );
            if (!product) {
                throw new NotFoundException("Product not found");
            }
        }
        // clear cart products
        cart.products = [];
        await cart.save();
        return {
            message: "Order paid successfully", order
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment success
    async paymentSuccess() {
        return {
            message: "Payment success"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // payment cancel
    async paymentCancel() {
        return {
            message: "Payment cancelled"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // cancel order
    async cancelOrder(orderId: Types.ObjectId, user: UserDocument) {
        const order = await this._orderRepository.findOneAndUpdate(
            {
                _id: orderId, userId: user._id,
                status: {$in: [OrderStatusTypes.pending, OrderStatusTypes.placed, OrderStatusTypes.paid]}
            }, {
                status: OrderStatusTypes.cancelled,
                orderChanges: {
                    cancelledAt: new Date(),
                    cancelledBy: user._id
                }
            }
        )
        if (!order) {
            throw new NotFoundException("Order not found");
        }

        if (order.paymentMethod == PaymentMethodTypes.card) {
            await this._paymentService.refund({
                payment_intent: order.paymentIntent,
                reason: "requested_by_customer"
            })
            await this._orderRepository.findOneAndUpdate({_id: orderId, userId: user._id}, {
                status: OrderStatusTypes.refunded,
                orderChanges: {
                    refundedAt: new Date(),
                    refundedBy: user._id
                }
            })
        }
        return {
            message: "Order cancelled successfully"
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // get all orders
    async getAllOrders(user: UserDocument) {
        return await this._orderRepository.find({
            filter: {userId: user._id},
            populate: [
                {path: "cartId"}
            ]
        });
    }
}
