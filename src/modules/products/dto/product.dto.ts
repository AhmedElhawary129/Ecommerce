import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength, Validate } from "class-validator";
import { Types } from "mongoose";
import { QueryFilterDto } from "src/common/utils/filter-query.dto";

export class CreateProductDto {
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    description: string;

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

    @IsString()
    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    brand: string;

    mainImage: object;

    @IsArray()
    @IsOptional()
    subImages: object[];

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @Type(() => Number)
    @IsNotEmpty()
    @IsNumber()
    stock: number;
}

//----------------------------------------------------------------------------------------------------------------

export class UpdateProductDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    name: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    description: string;

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

    @IsString()
    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    brand: string;

    @IsOptional()
    mainImage: object;

    @IsArray()
    @IsOptional()
    subImages: object[];

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    discount: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    quantity: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    stock: number;
}

//----------------------------------------------------------------------------------------------------------------

export class QueryDto extends QueryFilterDto{
    @IsOptional()
    @IsString()
    name? : string;
}