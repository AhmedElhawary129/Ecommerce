import { Injectable } from "@nestjs/common";
import { PaymentMethodTypes } from "src/common/types/types";
import Stripe from "stripe";


@Injectable()
export class PaymentService {
    constructor() {}

    private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
        

    async createCheckoutSession({
        customer_email,
        metadata,
        line_items,
        discounts
    }) {
        return this.stripe.checkout.sessions.create({
            payment_method_types: [PaymentMethodTypes.card],
            mode: "payment",
            customer_email,
            metadata,
            success_url:"http://localhost:3000/orders/success",
            cancel_url:"http://localhost:3000/orders/cancel",
            line_items,
            discounts
        });
    }

    async createCoupon({percent_off}) {
        return await this.stripe.coupons.create({
            percent_off,
            duration: "once"
        })
    }

    async refund({reason, payment_intent}) {
        return await this.stripe.refunds.create({
            payment_intent,
            reason
        })
    }
}
