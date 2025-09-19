import { Injectable } from "@nestjs/common";
import { Order, OrderDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class OrderRepository extends DataBaseRepository<OrderDocument> {
    constructor(@InjectModel(Order.name) private readonly _OrderModel: Model<OrderDocument>) {
        super(_OrderModel)
    }
}