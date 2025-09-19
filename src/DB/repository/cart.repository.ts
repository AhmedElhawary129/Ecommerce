import { Injectable } from "@nestjs/common";
import { Cart, CartDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class CartRepository extends DataBaseRepository<CartDocument> {
    constructor(@InjectModel(Cart.name) private readonly _CartModel: Model<CartDocument>) {
        super(_CartModel)
    }
}