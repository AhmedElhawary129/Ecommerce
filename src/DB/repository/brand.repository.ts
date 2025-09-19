import { Injectable } from "@nestjs/common";
import { Brand, BrandDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class BrandRepository extends DataBaseRepository<BrandDocument> {
    constructor(@InjectModel(Brand.name) private readonly _BrandModel: Model<BrandDocument>) {
        super(_BrandModel)
    }
}