import { IsNotEmpty, IsObject, IsOptional, IsString, Validate } from "class-validator";
import { Types } from "mongoose";


export class CreateSubCategoryDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    category: string;
}

//----------------------------------------------------------------------------------------------------------------

export class UpdateSubCategoryDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsObject()
    @IsOptional()
    image: {
        secure_url: string,
        public_id: string
    }

    @IsString()
    @IsOptional()
    @Validate((value: Types.ObjectId) => {
        return Types.ObjectId.isValid(value);
    })
    category: string;
}