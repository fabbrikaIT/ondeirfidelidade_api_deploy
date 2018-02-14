export declare class ServiceResult {
    ErrorCode: string;
    ErrorMessage: string;
    Result: any;
    static HandlerError(error: any): ServiceResult;
}
