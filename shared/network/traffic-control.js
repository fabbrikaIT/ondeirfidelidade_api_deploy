"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genericErrors_1 = require("../../config/errors/genericErrors");
const log_provider_1 = require("../log/log-provider");
const network_log_model_1 = require("./../log/network-log.model");
class TrafficControl {
    CheckPostBody(req, res, next) {
        if (req.method === "POST") {
            if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
                res.json(genericErrors_1.GenericErrorsProvider.GetError(genericErrors_1.EGenericErrors.InvalidRequestBody));
                res.end();
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    }
    LogRequest(req, res, next) {
        if (process.env.NETWORK_LOG !== undefined && process.env.NETWORK_LOG === "Y") {
            const log = new network_log_model_1.NetworkLog(req);
            log_provider_1.default.SaveNetworkLog(log);
            next();
        }
    }
    SetStatusCode(req, res, next) {
        var send = res.send;
        res.send = function (data) {
            let body;
            try {
                body = JSON.parse(data);
            }
            catch (error) {
            }
            if (body && body.ErrorCode !== undefined && body.ErrorCode !== "") {
                switch (body.ErrorCode) {
                    case "ERR999":
                        res.status(500);
                        break;
                    default:
                        res.status(422);
                        break;
                }
            }
            send.call(this, data);
        };
        next();
    }
}
exports.default = new TrafficControl();
//# sourceMappingURL=traffic-control.js.map