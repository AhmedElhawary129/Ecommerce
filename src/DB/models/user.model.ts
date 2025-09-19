import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Encrypt } from "src/common/security/encryption";
import { Hash } from "src/common/security/Hash";
import { UserGender, UserRoles } from "src/common/types/types";

@Schema({timestamps: {createdAt: true, updatedAt: true}, toJSON: {virtuals: true}, toObject: {virtuals: true}})
export class User {

    @Prop({type: String, required: true, minLength: 3, maxLength: 30, trim: true})
    firstName: string;

    @Prop({type: String, required: true, minLength: 3, maxLength: 30, trim: true})
    lastName: string;

    @Virtual({
        get: function (this: User) {
            return `${this.firstName} ${this.lastName}`;
        },
    })
    fullName: string;


    @Prop({type: String, required: true, unique: true, trim: true})
    email: string;

    @Prop({type: String, required: true, minLength: 8})
    password: string;

    @Prop({type: Date, required: true})
    DOB: Date;

    @Prop({type: Boolean, default: false})
    confirmed: boolean;

    @Prop({type: Boolean, default: false})
    isDeleted: boolean;

    @Prop({type: String, enum: UserRoles, default: UserRoles.user})
    role: string;

    @Prop({type: String, required: true})
    phone: string;

    @Prop({type: String, required: true})
    address: string;

    @Prop({type: String, required: true, enum: UserGender, default: UserGender.other})
    gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// hash password and encrypt phone by hooks
UserSchema.pre("save", function(next) {
    if (this.isDirectModified("password")) {
        this.password = Hash(this.password)
    }
    if (this.isDirectModified("phone")) {
        this.phone = Encrypt(this.phone)
    }
    next()
})

export const UserModel= MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
export type UserDocument = HydratedDocument<User>;