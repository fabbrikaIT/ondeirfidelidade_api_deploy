"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reports_controller_1 = require("./../controllers/reports.controller");
const base_routes_1 = require("./base.routes");
class ReportsRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.controller = new reports_controller_1.ReportsController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.get('/dashboard/loyalties/:ownerId', this.controller.GetLoyaltiesNumber);
        this.router.get('/dashboard/offers/:ownerId', this.controller.GetOffersNumber);
        this.router.get('/dashboard/clients/:ownerId', this.controller.GetClientsNumber);
        this.router.get('/dashboard/coupons/:ownerId', this.controller.GetCouponsNumber);
    }
}
exports.ReportsRoutes = ReportsRoutes;
//# sourceMappingURL=report.routes.js.map