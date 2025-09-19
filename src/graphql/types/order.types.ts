import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Types } from "mongoose";
import { OrderStatusTypes, PaymentMethodTypes } from "src/common/types/types";
import { Cart, Order } from "src/DB/models";

registerEnumType(OrderStatusTypes, { name: "OrderStatusTypes"});
registerEnumType(PaymentMethodTypes, { name: "PaymentMethodTypes"});


@ObjectType()
export class CartProductsType {
    @Field(() => ID, { nullable: false })
    productId: Types.ObjectId;

    @Field(() => Number, { nullable: false })
    quantity: number;

    @Field(() => Number, { nullable: false })
    finalPrice: number
}

//----------------------------------------------------------------------------------------------------------------

@ObjectType()
export class CartType implements Partial<Cart> {
    @Field(() => ID, { nullable: false })
    _id: string;

    @Field(() => ID, { nullable: false })
    userId: Types.ObjectId;

    @Field(() => [CartProductsType], { nullable: false })
    products: CartProductsType[];

    @Field(() => Number, { nullable: false })
    subTotal: number;
}

//----------------------------------------------------------------------------------------------------------------

@ObjectType()
export class OrderType implements Partial<Order> {
    @Field(() => ID, { nullable: false })
    _id: string;

    @Field(() => ID, { nullable: false })
    userId: Types.ObjectId;

    @Field(() => CartType, { nullable: false })
    cartId: Types.ObjectId | undefined;

    @Field(() => Number, { nullable: false })
    totalPrice: number;

    @Field(() => String, { nullable: false })
    phone: string;

    @Field(() => String, { nullable: false })
    address: string;

    @Field(() => PaymentMethodTypes, { nullable: false })
    paymentMethod: string;

    @Field(() => OrderStatusTypes, { nullable: false })    
    status: string;

    @Field(() => Date, { nullable: true })    
    arrivesAt: Date;
}