"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("../../models/serviceResult.model");
const log_provider_1 = require("../../shared/log/log-provider");
var EOwnerErrors;
(function (EOwnerErrors) {
    EOwnerErrors[EOwnerErrors["InvalidOwnerRequiredParams"] = 1] = "InvalidOwnerRequiredParams";
    EOwnerErrors[EOwnerErrors["EmailAlreadyExists"] = 2] = "EmailAlreadyExists";
    EOwnerErrors[EOwnerErrors["InvalidOwnerId"] = 3] = "InvalidOwnerId";
    EOwnerErrors[EOwnerErrors["LogoUploadError"] = 4] = "LogoUploadError";
    EOwnerErrors[EOwnerErrors["EmailNotFound"] = 5] = "EmailNotFound";
})(EOwnerErrors = exports.EOwnerErrors || (exports.EOwnerErrors = {}));
class OwnerErrorsProvider {
    static GetError(error) {
        const errorResult = new serviceResult_model_1.ServiceResult();
        errorResult.Executed = false;
        switch (error) {
            case EOwnerErrors.InvalidOwnerRequiredParams:
                errorResult.ErrorCode = "OWN001";
                errorResult.ErrorMessage = "Parâmetros de cliente obrigatórios nulos ou inválidos";
                break;
            case EOwnerErrors.EmailAlreadyExists:
                errorResult.ErrorCode = "OWN002";
                errorResult.ErrorMessage = "Já existe um cadastro para o e-mail informado";
                break;
            case EOwnerErrors.InvalidOwnerId:
                errorResult.ErrorCode = "OWN003";
                errorResult.ErrorMessage = "Código de identificação de cliente inválido";
                break;
            case EOwnerErrors.LogoUploadError:
                errorResult.ErrorCode = "OWN004";
                errorResult.ErrorMessage = "O Cliente foi criado com sucesso, porém ocorreu um erro no upload da imagem.";
                break;
            case EOwnerErrors.EmailNotFound:
                errorResult.ErrorCode = "OWN005";
                errorResult.ErrorMessage = "Não foi encontrado cadastro para o e-mail.";
                break;
            default:
                break;
        }
        log_provider_1.default.SetErrorLog(errorResult);
        return errorResult;
    }
    static GetErrorDetails(error, details) {
        const errorResult = this.GetError(error);
        errorResult.ErrorDetails = JSON.stringify(details);
        return errorResult;
    }
}
exports.OwnerErrorsProvider = OwnerErrorsProvider;
//# sourceMappingURL=ownerErrors.js.map