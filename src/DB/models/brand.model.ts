import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User, Category, SubCategory } from "./index";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class Brand {

    @Prop({type: String, required: true, minLength: 3, trim: true})
    name: string;

    @Prop({
        type: String, 
        default: function(){
            return slugify(this.name, {lower: true, trim: true, replacement: "-"})
        }})
    slug: string;

    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: Category.name, required: true})
    category: Types.ObjectId

    @Prop({type: Types.ObjectId, ref: SubCategory.name, required: true})
    subCategory: Types.ObjectId
    
    @Prop({
        type: {
            secure_url: {type: String},
            public_id: {type: String},
        }
    })
    image: {
        secure_url: string,
        public_id: string
    };

    @Prop({type: String})
    customId: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
export const BrandModel= MongooseModule.forFeature([{name: Brand.name, schema: BrandSchema}])
export type BrandDocument = HydratedDocument<Brand>;