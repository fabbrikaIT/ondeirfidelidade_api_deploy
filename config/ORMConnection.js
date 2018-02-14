"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class ORMConnection {
    constructor(dbName) {
        this.testConnection = (result) => {
            this.sequelize.authenticate()
                .then(() => {
                result(true);
            })
                .catch(err => {
                result(false);
            });
        };
        this._dbName = dbName;
        this.CreateConnection();
    }
    CreateConnection() {
        this.sequelize = new sequelize_1.Sequelize(this._dbName, process.env.DB_USER, process.env.DB_PASS, {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            pool: {
                max: process.env.DB_POOL_LIMIT,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            operatorsAliases: false
        });
    }
}
exports.ORMConnection = ORMConnection;
//# sourceMappingURL=ORMConnection.js.map