"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("./../../models/serviceResult.model");
const log_provider_1 = require("../../shared/log/log-provider");
var EAuthErrors;
(function (EAuthErrors) {
    EAuthErrors[EAuthErrors["InvalidUserOrPassword"] = 1] = "InvalidUserOrPassword";
    EAuthErrors[EAuthErrors["UserNotFound"] = 2] = "UserNotFound";
})(EAuthErrors = exports.EAuthErrors || (exports.EAuthErrors = {}));
class AuthErrorsProvider {
    static GetError(error) {
        const errorResult = new serviceResult_model_1.ServiceResult();
        errorResult.Executed = false;
        switch (error) {
            case EAuthErrors.InvalidUserOrPassword:
                errorResult.ErrorCode = "AUTH001";
                errorResult.ErrorMessage = "Usuário ou Senha inválidos";
                break;
            case EAuthErrors.UserNotFound:
                errorResult.ErrorCode = "AUTH002";
                errorResult.ErrorMessage = "Falha na autenticação - Usuário não encontrado.";
                break;
            default:
                break;
        }
        log_provider_1.default.SetErrorLog(errorResult);
        return errorResult;
    }
}
exports.AuthErrorsProvider = AuthErrorsProvider;
//# sourceMappingURL=authErrors.js.map