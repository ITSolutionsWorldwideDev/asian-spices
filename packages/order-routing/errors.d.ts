export declare class AppError extends Error {
    statusCode: number;
    code: string;
    constructor(message: string, code?: string, statusCode?: number);
}
