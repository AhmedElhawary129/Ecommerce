import { Injectable } from "@nestjs/common";
import { User, UserDocument } from "../models/user.model";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class UserRepository extends DataBaseRepository<UserDocument> {
    constructor(@InjectModel(User.name) private readonly _UserModel: Model<UserDocument>) {
        super(_UserModel)
    }
}