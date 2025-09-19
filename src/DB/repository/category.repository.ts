import { Injectable } from "@nestjs/common";
import { Category, CategoryDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class CategoryRepository extends DataBaseRepository<CategoryDocument> {
    constructor(@InjectModel(Category.name) private readonly _CategoryModel: Model<CategoryDocument>) {
        super(_CategoryModel)
    }
}