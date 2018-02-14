import { ServiceResult } from './../../models/serviceResult.model';
export declare enum EAuthErrors {
    InvalidUserOrPassword = 1,
}
export declare class AuthErrorsProvider {
    static GetError(error: EAuthErrors): ServiceResult;
}
