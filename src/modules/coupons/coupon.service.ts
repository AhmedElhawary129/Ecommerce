import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CouponRepository } from "src/DB/repository/coupon.repository";
import { CreateCouponDto, UpdateCouponDto } from "./dto/coupon.dto";
import type { UserDocument } from "src/DB/models";
import { Types } from "mongoose";

@Injectable()
export class CouponService {
    constructor(
        private readonly _couponRepository: CouponRepository
    ) {}

    //----------------------------------------------------------------------------------------------------------------

    // create coupon
    async createCoupon(body: CreateCouponDto, user: UserDocument) {
        const { code, amount, fromDate, toDate } = body
        
        const couponExists = await this._couponRepository.findOne({filter: {code}});    
        if (couponExists) {
            throw new BadRequestException("Coupon already exists");
        } 
        const coupon = await this._couponRepository.create({ 
            userId: user._id,
            code, 
            amount, 
            fromDate, 
            toDate 
        });
        return {
            message: "Coupon created successfully", coupon
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // update coupon
    async updateCoupon(body: UpdateCouponDto, user: UserDocument, id: Types.ObjectId) {
        const { amount, fromDate, toDate } = body
        
        const coupon = await this._couponRepository.findOne({filter: {_id: id, userId: user._id}});    
        if (!coupon) {
            throw new NotFoundException("Coupon not found");
        }
        if (amount) {coupon.amount = amount}
        if (fromDate) {coupon.fromDate = fromDate}
        if (toDate) {coupon.toDate = toDate}
        await coupon.save();

        return {
            message: "Coupon updated successfully", coupon
        };
    }

    //----------------------------------------------------------------------------------------------------------------

    // delete coupon
    async deleteCoupon(user: UserDocument, id: Types.ObjectId) {
        
        const coupon = await this._couponRepository.findOneAndDelete({_id: id, userId: user._id});
        if (!coupon) {
            throw new NotFoundException("Coupon not found or you are not authorized to delete");
        }
        return {
            message: "Coupon deleted successfully"
        };
    }
}
