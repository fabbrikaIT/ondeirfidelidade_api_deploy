"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_routes_1 = require("./base.routes");
class IndexRoutes extends base_routes_1.BaseRoute {
    constructor() {
        super();
        this.router.get("/", (req, res) => {
            res.send(this.getVersion());
        });
    }
}
exports.IndexRoutes = IndexRoutes;
//# sourceMappingURL=index.route.js.map