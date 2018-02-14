"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const owner_controller_1 = require("./../controllers/owner.controller");
const base_routes_1 = require("./base.routes");
class OwnerRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.controller = new owner_controller_1.OwnerController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.get("/:id", this.controller.getOwner);
        this.router.get('/', this.controller.listOwners);
        this.router.post('/', this.controller.createOwner);
        this.router.post('/reset', this.controller.resetPassword);
        this.router.post('/updatePassword', this.controller.updatePassword);
        this.router.put('/', this.controller.updateOwner);
        this.router.delete('/:id', this.controller.deleteOwner);
    }
}
exports.OwnerRoutes = OwnerRoutes;
//# sourceMappingURL=owner.routes.js.map