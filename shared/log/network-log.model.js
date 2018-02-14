"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NetworkLog {
    constructor(req) {
        this.date = new Date();
        this.method = req.method;
        this.host = req.ip;
        this.service = req.path;
        this.body = JSON.stringify(req.body);
    }
}
exports.NetworkLog = NetworkLog;
//# sourceMappingURL=network-log.model.js.map