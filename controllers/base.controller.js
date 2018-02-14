"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceResult_model_1 = require("../models/serviceResult.model");
class BaseController {
    processDefaultResult(res, error, dataResult) {
        if (error) {
            return res.json(serviceResult_model_1.ServiceResult.HandlerError(error));
        }
        const serviceResult = new serviceResult_model_1.ServiceResult();
        serviceResult.Executed = true;
        serviceResult.Result = dataResult;
        return res.json(serviceResult);
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map