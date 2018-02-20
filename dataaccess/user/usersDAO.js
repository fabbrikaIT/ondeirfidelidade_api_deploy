"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userEntity_1 = require("./../../models/users/userEntity");
const baseDAO_1 = require("../baseDAO");
class UsersDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.GetUserOndeIrQuery = "SELECT * FROM USERS WHERE ONDE_IR_ID = ?";
        this.insertQuery = "INSERT INTO USERS SET ?";
        this.Create = (user, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = user.toMysqlDbEntity(true);
                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    connection.release();
                    return callback(error, results);
                });
            }, error => {
                callback(error, null);
            });
        };
    }
    GetUserByOndeIr(id, res, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.GetUserOndeIrQuery, id, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new userEntity_1.UserEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    connection.release();
                    return callback(res, error, ownerItem);
                }
                connection.release();
                return callback(res, error, null);
            });
        }, error => {
            return callback(res, error, null);
        });
    }
}
exports.UsersDAO = UsersDAO;
//# sourceMappingURL=usersDAO.js.map