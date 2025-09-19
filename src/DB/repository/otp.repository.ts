import { Injectable } from "@nestjs/common";
import { OTP, OTPDocument } from "../models/index";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { DataBaseRepository } from "./DataBase.Repository";
import { OTPTypes } from "src/common/types/types";

interface OtpOptions {
    otp: string,
    expireAt?: Date,
    otpType: OTPTypes,
    userId: Types.ObjectId
}

@Injectable()
export class OTPRepository extends DataBaseRepository<OTPDocument> {
    constructor(@InjectModel(OTP.name) private readonly _OTPModel: Model<OTPDocument>) {
        super(_OTPModel)
    }

    createOtp ({otp, expireAt, otpType, userId}: OtpOptions) {
        return this.create({
            otp,
            expireAt: expireAt || new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            otpType,
            userId
        })
    }
}