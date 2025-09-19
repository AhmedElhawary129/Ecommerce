import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";


export class AddToCartDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    @Type(() => Number)
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

//----------------------------------------------------------------------------------------------------------------

export class RemoveFromCartDto {
    @IsNotEmpty()
    @IsString()
    productId: string;
}

//----------------------------------------------------------------------------------------------------------------

export class UpdateQuantityDto {
    @IsNotEmpty()
    @IsString()
    productId: string;

    
    @Type(() => Number)
    @IsPositive()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}