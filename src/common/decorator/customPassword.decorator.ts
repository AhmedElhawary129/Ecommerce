import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
} from "class-validator";

@ValidatorConstraint({ async: false })
export class customPasswordConstraint implements ValidatorConstraintInterface {
    validate(confirmPassword: string, args: ValidationArguments) {
        if (confirmPassword !== args.object[args.constraints[0]]) {
            return false
        }
        return true
    }
}

//----------------------------------------------------------------------------------------------------------------

export function customPasswordDecorator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor, // class
            propertyName: propertyName, // confirmPassword
            options: validationOptions, // {message: "Validation failed"}
            constraints: ["password"], // password
            validator: customPasswordConstraint, 
        });
    };
}