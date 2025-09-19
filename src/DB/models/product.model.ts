import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User, Category, SubCategory, Brand } from "./index";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class Product {

    @Prop({type: String, required: true, minLength: 3, trim: true})
    name: string;

    @Prop({
        type: String, 
        default: function(){
            return slugify(this.name, {lower: true, trim: true, replacement: "-"})
        }})
    slug: string;


    @Prop({type: String, required: true, minLength: 3, trim: true})
    description: string;

    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: Category.name, required: true})
    category: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: SubCategory.name, required: true})
    subCategory: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: Brand.name, required: true})
    brand: Types.ObjectId

    @Prop({
        type: {
            secure_url: { type: String, required: true },
            public_id: { type: String, required: true },
        }, 
        required: true
    })
    mainImage: {
        secure_url: string,
        public_id: string
    };

    @Prop({
        type: [
            {
                secure_url: { type: String },
                public_id: { type: String },
            }
        ],
        default: []
    })
    subImages: { secure_url: string; public_id: string }[];

    @Prop({type: String})
    customId: string;

    @Prop({type: Number, required: true})
    price: number;

    @Prop({type: Number, required: true, min: 0, max: 100, default: 0})
    discount: number;

    @Prop({type: Number, required: true})
    subPrice: number;

    @Prop({type: Number, required: true})
    stock: number;

    @Prop({type: Number, required: true})
    quantity: number;

    @Prop({type: Number})
    rateNum: number;

    @Prop({type: Number})
    rateAvg: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductModel= MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}])
export type ProductDocument = HydratedDocument<Product>;