"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_log_model_1 = require("./app-log.model");
const dbConnection_1 = require("../../config/dbConnection");
class LogProvider {
    SaveNetworkLog(log) {
        const connDb = new dbConnection_1.DbConnection(process.env.DB_FIDELIDADE);
        connDb.Connect(connection => {
            const query = 'INSERT INTO NETWORK_LOGS SET ?';
            connection.query(query, log, (error, results) => {
                connection.release();
            });
        }, error => {
            console.log(error);
        });
    }
    SaveApplicationLog(log) {
        const connDb = new dbConnection_1.DbConnection(process.env.DB_FIDELIDADE);
        connDb.Connect(connection => {
            const query = 'INSERT INTO APPLICATION_LOG SET ?';
            connection.query(query, log, (error, results) => {
                connection.release();
            });
        }, error => {
            console.log(error);
        });
    }
    SetErrorLog(errorResult) {
        const log = new app_log_model_1.ApplicationLog();
        log.date = new Date();
        log.type = app_log_model_1.ELogType.Error;
        log.source = errorResult.ErrorCode;
        log.message = errorResult.ErrorMessage;
        this.SaveApplicationLog(log);
    }
    SetFatalLog(errorResult) {
        const log = new app_log_model_1.ApplicationLog();
        log.date = new Date();
        log.type = app_log_model_1.ELogType.Fatal;
        log.source = errorResult.ErrorCode;
        log.message = errorResult.ErrorMessage;
        this.SaveApplicationLog(log);
    }
}
exports.default = new LogProvider();
//# sourceMappingURL=log-provider.js.map