import { IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { Types } from "mongoose";

export class CreateBrandDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    category: string;

    @IsString()
    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    subCategory: string;
}

//----------------------------------------------------------------------------------------------------------------

export class UpdateBrandDto {
    @IsString()
    @IsOptional()
    name: string

    
    @IsString()
    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    category: string;

    @IsString()
    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    subCategory: string;

    @IsOptional()
    mainImage: object;
}