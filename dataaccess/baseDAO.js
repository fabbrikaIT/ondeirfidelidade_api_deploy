"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("../config/dbConnection");
class BaseDAO {
    constructor() {
        this.connDb = new dbConnection_1.DbConnection(process.env.DB_FIDELIDADE);
    }
}
exports.BaseDAO = BaseDAO;
//# sourceMappingURL=baseDAO.js.map