"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("./../controllers/auth.controller");
const base_routes_1 = require("./base.routes");
class AuthRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.controller = new auth_controller_1.AuthController();
        this.buildRoutes();
    }
    buildRoutes() {
        this.router.post("/", this.controller.OwnerLogin);
        this.router.post("/user", this.controller.UserLogin);
        this.router.get("/ondeiruser/:userid", this.controller.OndeIrUser);
    }
}
exports.AuthRoutes = AuthRoutes;
//# sourceMappingURL=auth.routes.js.map