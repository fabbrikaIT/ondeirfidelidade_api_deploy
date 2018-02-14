"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("./../../models/serviceResult.model");
const log_provider_1 = require("../../shared/log/log-provider");
var EOffersErrors;
(function (EOffersErrors) {
    EOffersErrors[EOffersErrors["InvalidOffersRequiredParams"] = 1] = "InvalidOffersRequiredParams";
    EOffersErrors[EOffersErrors["InvalidOwnerId"] = 2] = "InvalidOwnerId";
    EOffersErrors[EOffersErrors["InvalidOfferType"] = 3] = "InvalidOfferType";
    EOffersErrors[EOffersErrors["InvalidDiscountParams"] = 4] = "InvalidDiscountParams";
    EOffersErrors[EOffersErrors["InvalidPromotionParams"] = 5] = "InvalidPromotionParams";
    EOffersErrors[EOffersErrors["OwnerNotFound"] = 6] = "OwnerNotFound";
    EOffersErrors[EOffersErrors["InvalidOfferId"] = 7] = "InvalidOfferId";
    EOffersErrors[EOffersErrors["HasValidCounpons"] = 8] = "HasValidCounpons";
    EOffersErrors[EOffersErrors["OfferNotFound"] = 9] = "OfferNotFound";
})(EOffersErrors = exports.EOffersErrors || (exports.EOffersErrors = {}));
class OffersErrorsProvider {
    static GetError(error) {
        const errorResult = new serviceResult_model_1.ServiceResult();
        errorResult.Executed = false;
        switch (error) {
            case EOffersErrors.InvalidOffersRequiredParams:
                errorResult.ErrorCode = "OFF001";
                errorResult.ErrorMessage = "Parâmetros de oferta obrigatórios nulos ou inválidos";
                break;
            case EOffersErrors.InvalidOwnerId:
                errorResult.ErrorCode = "OFF002";
                errorResult.ErrorMessage = "Código de cliente inválido ou nulo";
                break;
            case EOffersErrors.InvalidOfferType:
                errorResult.ErrorCode = "OFF003";
                errorResult.ErrorMessage = "Tipo de oferta inválido";
                break;
            case EOffersErrors.InvalidDiscountParams:
                errorResult.ErrorCode = "OFF004";
                errorResult.ErrorMessage = "Parâmetros de oferta de desconto nulos ou inválidos";
                break;
            case EOffersErrors.InvalidPromotionParams:
                errorResult.ErrorCode = "OFF005";
                errorResult.ErrorMessage = "Parâmetros de oferta de promocional nulos ou inválidos";
                break;
            case EOffersErrors.OwnerNotFound:
                errorResult.ErrorCode = "OFF005";
                errorResult.ErrorMessage = "O Cliente informado não foi encontrado ou está inativoo";
                break;
            case EOffersErrors.InvalidOfferId:
                errorResult.ErrorCode = "OFF007";
                errorResult.ErrorMessage = "Código de oferta nulo ou inválido";
                break;
            case EOffersErrors.HasValidCounpons:
                errorResult.ErrorCode = "OFF008";
                errorResult.ErrorMessage = "Não é possível excluir uma oferta com cupons de descontos. Favor inativá-la!";
                break;
            case EOffersErrors.OfferNotFound:
                errorResult.ErrorCode = "OFF009";
                errorResult.ErrorMessage = "A Oferta informada não foi encontrada.";
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
exports.OffersErrorsProvider = OffersErrorsProvider;
//# sourceMappingURL=offersErrors.js.map