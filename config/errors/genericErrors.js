"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("./../../models/serviceResult.model");
const log_provider_1 = require("../../shared/log/log-provider");
var EGenericErrors;
(function (EGenericErrors) {
    EGenericErrors[EGenericErrors["InvalidRequestBody"] = 1] = "InvalidRequestBody";
    EGenericErrors[EGenericErrors["InvalidArguments"] = 2] = "InvalidArguments";
})(EGenericErrors = exports.EGenericErrors || (exports.EGenericErrors = {}));
class GenericErrorsProvider {
    static GetError(error) {
        const errorResult = new serviceResult_model_1.ServiceResult();
        errorResult.Executed = false;
        switch (error) {
            case EGenericErrors.InvalidRequestBody:
                errorResult.ErrorCode = "GENC001";
                errorResult.ErrorMessage = "The request post body is invalid or empty";
                break;
            case EGenericErrors.InvalidArguments:
                errorResult.ErrorCode = "GENC002";
                errorResult.ErrorMessage = "Os parâmetros do serviço são inválidos ou nulos";
                break;
            default:
                break;
        }
        log_provider_1.default.SetErrorLog(errorResult);
        return errorResult;
    }
}
exports.GenericErrorsProvider = GenericErrorsProvider;
//# sourceMappingURL=genericErrors.js.map