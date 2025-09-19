import { Injectable } from "@nestjs/common";
import { Product, ProductDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class ProductRepository extends DataBaseRepository<ProductDocument> {
    constructor(@InjectModel(Product.name) private readonly _ProductModel: Model<ProductDocument>) {
        super(_ProductModel)
    }
}