"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class DbConnection {
    constructor(dbName) {
        this.Connect = (successCallback, errorCallback) => {
            if (this.connectionPool == null) {
                this.CreateConnection();
            }
            this.connectionPool.getConnection(function (poolError, connection) {
                if (poolError) {
                    errorCallback(poolError);
                    return;
                }
                successCallback(connection);
            });
        };
        this._dbName = dbName;
        this.CreateConnection();
    }
    CreateConnection() {
        this.CONNECTION_CONFIG = {
            connectionLimit: process.env.DB_POOL_LIMIT,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: this._dbName,
            multipleStatements: true
        };
        if (this.CONNECTION_CONFIG.host === undefined || this.CONNECTION_CONFIG.database === undefined) {
            this.connectionPool = null;
        }
        else {
            this.connectionPool = mysql.createPool(this.CONNECTION_CONFIG);
        }
    }
}
exports.DbConnection = DbConnection;
//# sourceMappingURL=dbConnection.js.map