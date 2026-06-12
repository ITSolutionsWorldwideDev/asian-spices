// packages/order-routing/errors.ts
export class AppError extends Error {
    statusCode;
    code;
    constructor(message, code = "UNKNOWN", statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}
