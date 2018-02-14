"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offers_controller_1 = require("./../controllers/offers.controller");
const base_routes_1 = require("./base.routes");
class OffersRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.controller = new offers_controller_1.OffersController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.get("/:id", this.controller.GetOffers);
        this.router.get("/list/:owner", this.controller.ListOffers);
        this.router.get("/list/:owner/:status", this.controller.ListOffersStatus);
        this.router.post("/", this.controller.CreateOffer);
        this.router.post("/activate", this.controller.ActiveOffer);
        this.router.post("/deactivate", this.controller.InativateOffer);
        this.router.put("/", this.controller.UpdateOffer);
        this.router.delete("/:id", this.controller.DeleteOffer);
    }
}
exports.OffersRoutes = OffersRoutes;
//# sourceMappingURL=offers.routes.js.map