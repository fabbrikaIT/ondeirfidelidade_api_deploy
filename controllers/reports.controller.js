"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_controller_1 = require("./base.controller");
const genericErrors_1 = require("../config/errors/genericErrors");
const reportsDAO_1 = require("../dataaccess/reports/reportsDAO");
class ReportsController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.dataAccess = new reportsDAO_1.ReportsDAO();
        this.GetLoyaltiesNumber = (req, res) => {
            const ownerId = this.GetOwnerId(req, res);
            if (ownerId >= 0) {
                return this.dataAccess.GetLoyaltyNumber(ownerId, res, this.processDefaultResult);
            }
            else {
                return;
            }
        };
        this.GetOffersNumber = (req, res) => {
            const ownerId = this.GetOwnerId(req, res);
            if (ownerId >= 0) {
                return this.dataAccess.GetOffersNumber(ownerId, res, this.processDefaultResult);
            }
            else {
                return;
            }
        };
        this.GetClientsNumber = (req, res) => {
        };
        this.GetCouponsNumber = (req, res) => {
        };
        this.GetOwnerId = (req, res) => {
            req.checkParams("ownerId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                res.json(genericErrors_1.GenericErrorsProvider.GetError(genericErrors_1.EGenericErrors.InvalidArguments));
                return -1;
            }
            return req.params["ownerId"];
        };
    }
}
exports.ReportsController = ReportsController;
//# sourceMappingURL=reports.controller.js.map