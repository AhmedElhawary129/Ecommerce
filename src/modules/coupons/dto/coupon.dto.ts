import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min, Validate } from "class-validator";
import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";

@ValidatorConstraint({ async: true })
export class IsToDateAfterFromDateConstraint implements ValidatorConstraintInterface {
    validate(toDate: any, args: ValidationArguments) {
        if (toDate < args.object["fromDate"]) {
            return false;
        }
        return true;
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be after ${args.object["fromDate"]}`;
    }
}

//----------------------------------------------------------------------------------------------------------------

@ValidatorConstraint({ async: true })
export class FromDateInFutureConstraint implements ValidatorConstraintInterface {
    validate(fromDate: any, args: ValidationArguments) {
        return fromDate >= new Date();
    }
    defaultMessage(args: ValidationArguments) {
        return `${args.property} must be in the future`;
    }
}

//----------------------------------------------------------------------------------------------------------------

export class CreateCouponDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 10)
    code: string;

    @Type(() => Number)
    @IsPositive()
    @IsNotEmpty()
    @Min(1)
    @Max(100)
    @IsNumber()
    amount: number;

    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(FromDateInFutureConstraint)
    fromDate: Date;

    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    @Validate(IsToDateAfterFromDateConstraint)
    toDate: Date;
}

//----------------------------------------------------------------------------------------------------------------

export class UpdateCouponDto {
    @Type(() => Number)
    @IsPositive()
    @IsOptional()
    @Min(1)
    @Max(100)
    @IsNumber()
    amount: number;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    @Validate(FromDateInFutureConstraint)
    fromDate: Date;

    @Type(() => Date)
    @IsOptional()
    @IsDate()
    @Validate(IsToDateAfterFromDateConstraint)
    toDate: Date;
}