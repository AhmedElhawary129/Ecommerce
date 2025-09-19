import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { User } from "./index";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class Coupon {

    @Prop({type: String, required: true, minLength: 1, trim: true, unique: true})
    code: string;

    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: Types.ObjectId

    @Prop({type: Number, min: 1, max: 100, required: true})
    amount: number

    @Prop({type: Date, required: true})
    fromDate: Date;

    @Prop({type: Date, required: true})
    toDate: Date

    @Prop({type: [Types.ObjectId], ref: User.name, default: []})
    usedBy: Types.ObjectId[]
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
export const CouponModel= MongooseModule.forFeature([{name: Coupon.name, schema: CouponSchema}])
export type CouponDocument = HydratedDocument<Coupon>;