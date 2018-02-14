"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
class OwnerDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super(...arguments);
        this.Login = (email, password, callback) => {
            this.connDb.Connect(connection => {
                const query = 'SELECT * FROM OWNER WHERE EMAIL = ? AND PASSWORD = ?';
                connection.query(query, [email, password], (error, results) => {
                    callback(results, error);
                });
            }, error => {
                callback(null, error);
            });
        };
    }
}
exports.OwnerDAO = OwnerDAO;
//# sourceMappingURL=ownerDAO.js.map