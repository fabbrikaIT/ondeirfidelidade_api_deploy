"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const parser = require("body-parser");
const framework = require("swt-framework");
const expressValidator = require("express-validator");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");
const index_route_1 = require("../routes/index.route");
const traffic_control_1 = require("../shared/network/traffic-control");
const owner_routes_1 = require("../routes/owner.routes");
const loyalty_route_1 = require("../routes/loyalty.route");
const offers_routes_1 = require("../routes/offers.routes");
const auth_routes_1 = require("./../routes/auth.routes");
const report_routes_1 = require("../routes/report.routes");
class Server {
    constructor() {
        this.apiVersion = "/v0";
        this.express = express();
        this.ApplySettings();
        this.ConfigurateRoutes();
    }
    ApplySettings() {
        const dotenv = require("dotenv");
        // Linux
        // -----------------------------------------------------------------
        if (process.env.NODE_ENV == "production") {
            dotenv.config({ path: __dirname + "/settings/prod.env" });
        }
        else {
            dotenv.config({ path: __dirname + "/settings/dev.env" });
        }

        // Windows
        // -----------------------------------------------------------------
        // if (process.env.NODE_ENV == "production") {
        //     dotenv.config({ path: __dirname + "\\settings\\prod.env" });
        // }
        // else {
        //     dotenv.config({ path: __dirname + "\\settings\\dev.env" });
        // }

        this.express.use(parser.json({ limit: '50mb' }));
        this.express.use(parser.urlencoded({ extended: true, limit: '50mb' }));
        this.express.use(framework.security.enablePreflight);
        this.express.use(expressValidator());
        this.express.use(traffic_control_1.default.CheckPostBody);
        this.express.use(traffic_control_1.default.LogRequest);
        this.express.use(traffic_control_1.default.SetStatusCode);
    }
    ConfigurateRoutes() {
        const indexRoutes = new index_route_1.IndexRoutes();
        const authRoutes = new auth_routes_1.AuthRoutes();
        const ownerRoutes = new owner_routes_1.OwnerRoutes();
        const loyaltyRoutes = new loyalty_route_1.LoyaltyRoutes();
        const offersRoutes = new offers_routes_1.OffersRoutes();
        const reportsRoutes = new report_routes_1.ReportsRoutes();
        this.express.use("/", indexRoutes.router);
        this.express.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        this.express.use(this.apiVersion + "/auth", authRoutes.router);
        this.express.use(this.apiVersion + "/owner", ownerRoutes.router);
        this.express.use(this.apiVersion + "/loyalty", loyaltyRoutes.router);
        this.express.use(this.apiVersion + "/offers", offersRoutes.router);
        this.express.use(this.apiVersion + "/reports", reportsRoutes.router);
    }
}
exports.default = new Server().express;
//# sourceMappingURL=server.js.map