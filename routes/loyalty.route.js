"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_routes_1 = require("./base.routes");
const loyalty_controller_1 = require("../controllers/loyalty.controller");
class LoyaltyRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.controller = new loyalty_controller_1.LoyaltyController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.get("/:id", this.controller.GetLoyalty);
        this.router.get("/list/:owner", this.controller.ListLoyalty);
        this.router.get("/list/:owner/:status", this.controller.ListLoyaltyStatus);
        this.router.post("/", this.controller.CreateLoyalty);
        this.router.post("/activate", this.controller.ActivateLoyalty);
        this.router.post("/deactivate", this.controller.DeactivateLoyalty);
        this.router.put("/", this.controller.UpdateLoyalty);
        this.router.delete("/:id", this.controller.DeleteLoyalty);
    }
}
exports.LoyaltyRoutes = LoyaltyRoutes;
//# sourceMappingURL=loyalty.route.js.map