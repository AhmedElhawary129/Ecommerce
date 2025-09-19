import { Injectable } from "@nestjs/common";
import { SubCategory, SubCategoryDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class SubCategoryRepository extends DataBaseRepository<SubCategoryDocument> {
    constructor(@InjectModel(SubCategory.name) private readonly _SubCategoryModel: Model<SubCategoryDocument>) {
        super(_SubCategoryModel)
    }
}