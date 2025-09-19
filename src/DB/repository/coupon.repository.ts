import { Injectable } from "@nestjs/common";
import { Coupon, CouponDocument } from "../models/index";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";


@Injectable()
export class CouponRepository extends DataBaseRepository<CouponDocument> {
    constructor(@InjectModel(Coupon.name) private readonly _CouponModel: Model<CouponDocument>) {
        super(_CouponModel)
    }
}