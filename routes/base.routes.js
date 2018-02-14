"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
var pjson = require("../package.json");
class BaseRoute {
    constructor() {
        this.router = express.Router();
    }
    getVersion() {
        return pjson.description + " - Version: " + pjson.version;
    }
    getApiVersion() {
        return "v1";
    }
}
exports.BaseRoute = BaseRoute;
//# sourceMappingURL=base.routes.js.map