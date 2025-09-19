import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import slugify from "slugify";
import { User } from "./index";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class Category {

    @Prop({type: String, required: true, unique: true, minLength: 3, trim: true, lowercase: true})
    name: string;

    @Prop({
        type: String, 
        default: function(){
            return slugify(this.name, {lower: true, trim: true, replacement: "-"})
        }})
    slug: string;

    @Prop({type: Types.ObjectId, ref: User.name, required: true})
    userId: Types.ObjectId

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

export const CategorySchema = SchemaFactory.createForClass(Category);
export const CategoryModel= MongooseModule.forFeature([{name: Category.name, schema: CategorySchema}])
export type CategoryDocument = HydratedDocument<Category>;