import { ValidationError } from "express-validator";
import { CustomError } from '../errors/custom-error';

export class RequestValidationError extends CustomError {
    statusCode: number = 400;
    constructor(private errors: ValidationError[]) {
        super('Invalid request parameters');

        // Only because we extends built in class Error
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map(err => {
            return { message: err.msg, field: err.param }
        })
    }
}
