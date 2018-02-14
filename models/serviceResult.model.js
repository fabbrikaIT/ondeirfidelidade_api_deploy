"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceResult {
    constructor() {
        this.ErrorCode = "";
        this.ErrorMessage = "";
        this.ErrorDetails = "";
        this.Executed = true;
    }
    static HandlerError(error) {
        const result = new ServiceResult();
        result.ErrorCode = "ERR999";
        result.ErrorMessage = JSON.stringify(error);
        result.Executed = false;
        return result;
    }
    static HandlerSucess() {
        const result = new ServiceResult();
        result.ErrorCode = "";
        result.ErrorMessage = "";
        result.Executed = true;
        return result;
    }
}
exports.ServiceResult = ServiceResult;
//# sourceMappingURL=serviceResult.model.js.map