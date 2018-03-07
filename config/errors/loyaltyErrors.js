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
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyNotActive"] = 9] = "LoyaltyNotActive";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyOutOfDate"] = 10] = "LoyaltyOutOfDate";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyOutValidity"] = 11] = "LoyaltyOutValidity";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyDayLimitExceeded"] = 12] = "LoyaltyDayLimitExceeded";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyUsageWait"] = 13] = "LoyaltyUsageWait";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyPointsGoal"] = 14] = "LoyaltyPointsGoal";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyProgramNotFound"] = 15] = "LoyaltyProgramNotFound";
    ELoyaltyErrors[ELoyaltyErrors["LoyaltyNotPointsGoal"] = 16] = "LoyaltyNotPointsGoal";
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
            case ELoyaltyErrors.LoyaltyNotActive:
                errorResult.ErrorCode = "LYT009";
                errorResult.ErrorMessage = "O programa de fidelidade não está ativo.";
                break;
            case ELoyaltyErrors.LoyaltyOutOfDate:
                errorResult.ErrorCode = "LYT010";
                errorResult.ErrorMessage = "Não é possível pontuar no programa de fidelidade na data e hora atuais.";
                break;
            case ELoyaltyErrors.LoyaltyOutValidity:
                errorResult.ErrorCode = "LYT011";
                errorResult.ErrorMessage = "O programa de fidelidade não está vigênte neste momento, confira os dias e horários para uso.";
                break;
            case ELoyaltyErrors.LoyaltyDayLimitExceeded:
                errorResult.ErrorCode = "LYT012";
                errorResult.ErrorMessage = "Limite do uso diário do programa excedido.";
                break;
            case ELoyaltyErrors.LoyaltyUsageWait:
                errorResult.ErrorCode = "LYT013";
                errorResult.ErrorMessage = "Tempo de espera desde última utilização não respeitado.";
                break;
            case ELoyaltyErrors.LoyaltyPointsGoal:
                errorResult.ErrorCode = "LYT014";
                errorResult.ErrorMessage = "Número de pontos para resgate alcançado, mostre o cartão no local para retirar sua recompensa.";
                break;
            case ELoyaltyErrors.LoyaltyProgramNotFound:
                errorResult.ErrorCode = "LYT015";
                errorResult.ErrorMessage = "Programa de fidelidade não encontrado.";
                break;
            case ELoyaltyErrors.LoyaltyNotPointsGoal:
                errorResult.ErrorCode = "LYT016";
                errorResult.ErrorMessage = "Pontuação necessária para resgate ainda não alcançada.";
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