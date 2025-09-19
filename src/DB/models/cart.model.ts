import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User, Product } from "./index";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class Cart {

    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: Types.ObjectId;

    @Prop({type: [{
        productId: {type: Types.ObjectId, ref: Product.name, required: true},
        quantity: {type: Number, required: true},
        finalPrice: {type: Number, required: true}
    }]})
    products: {productId: Types.ObjectId, quantity: number, finalPrice: number}[];

    @Prop({type: Number})
    subTotal: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.pre("save", function(next) {
    this.subTotal = this.products.reduce((acc, prod) => acc + (prod.finalPrice * prod.quantity), 0)
    next()
})

export const CartModel= MongooseModule.forFeature([{name: Cart.name, schema: CartSchema}])
export type CartDocument = HydratedDocument<Cart>;