"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("../../models/serviceResult.model");
const log_provider_1 = require("../../shared/log/log-provider");
var ELoyaltyErrors;
(function (ELoyaltyErrors) {
    ELoyaltyErrors[ELoyaltyErrors["InvalidLoyaltyRequiredParams"] = 1] = "InvalidLoyaltyRequiredParams";
    ELoyaltyErrors[ELoyaltyErrors["InvalidOwnerId"] = 2] = "InvalidOwnerId";
    ELoyaltyErrors[ELoyaltyErrors["InvalidLoyaltyId"] = 3] = "InvalidLoyaltyId";
    ELoyaltyErrors[ELoyaltyErrors["OwnerNotFound"] = 4] = "OwnerNotFound";
    ELoyaltyErrors[ELoyaltyErrors["InvalidLoyaltyType"] = 5] = "InvalidLoyaltyType";
    ELoyaltyErrors[ELoyaltyErrors["NotImplementedLoyaltyType"] = 6] = "NotImplementedLoyaltyType";
    ELoyaltyErrors[ELoyaltyErrors["ProgramWithParticipants"] = 7] = "ProgramWithParticipants";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyNotFound"] = 8] = "LoyaltyNotFound";
})(ELoyaltyErrors = exports.ELoyaltyErrors || (exports.ELoyaltyErrors = {}));
class LoyaltyErrorsProvider {
    static GetError(error) {
        const errorResult = new serviceResult_model_1.ServiceResult();
        errorResult.Executed = false;
        switch (error) {
            case ELoyaltyErrors.InvalidLoyaltyRequiredParams:
                errorResult.ErrorCode = "LYT001";
                errorResult.ErrorMessage = "Parâmetros de fidelidade obrigatórios nulos ou inválidos";
                break;
            case ELoyaltyErrors.InvalidOwnerId:
                errorResult.ErrorCode = "LYT002";
                errorResult.ErrorMessage = "Código de cliente inválido ou nulo";
                break;
            case ELoyaltyErrors.InvalidLoyaltyId:
                errorResult.ErrorCode = "LYT003";
                errorResult.ErrorMessage = "Código de programa de fidelidade inválido ou nulo";
                break;
            case ELoyaltyErrors.OwnerNotFound:
                errorResult.ErrorCode = "LYT004";
                errorResult.ErrorMessage = "O Cliente informado não foi encontrado ou está inativo";
                break;
            case ELoyaltyErrors.InvalidLoyaltyType:
                errorResult.ErrorCode = "LYT005";
                errorResult.ErrorMessage = "Tipo de programa de fidalidade inválido";
                break;
            case ELoyaltyErrors.NotImplementedLoyaltyType:
                errorResult.ErrorCode = "LYT006";
                errorResult.ErrorMessage = "Tipo de programa de fidalidade não disponível no momento";
                break;
            case ELoyaltyErrors.ProgramWithParticipants:
                errorResult.ErrorCode = "LYT007";
                errorResult.ErrorMessage = "Não é possível excluir um programa de fidelidade com participantes. Para cancelar o programa, favor inativá-lo";
                break;
            case ELoyaltyErrors.LoyaltyNotFound:
                errorResult.ErrorCode = "LYT008";
                errorResult.ErrorMessage = "O programa de fidelidade não foi encontrado.";
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
exports.LoyaltyErrorsProvider = LoyaltyErrorsProvider;
//# sourceMappingURL=loyaltyErrors.js.map