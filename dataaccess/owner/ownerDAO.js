"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
const ownerEntity_1 = require("../../models/owner/ownerEntity");
class OwnerDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.insertQuery = "INSERT INTO OWNER SET ?";
        this.listQuery = "SELECT * FROM OWNER";
        this.getOwnerQuery = "SELECT * FROM OWNER WHERE ID = ?";
        this.getOwnerByEmailQuery = "SELECT * FROM OWNER WHERE EMAIL = ?";
        this.deleteOwnerQuery = "DELETE FROM OWNER WHERE ID = ?";
        this.updatePasswordQuery = "UPDATE OWNER SET PASSWORD=? WHERE ID=?";
        this.updateQuery = "UPDATE OWNER SET ? WHERE ID= ?";
        this.ListOwners = (res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.listQuery, (error, results) => {
                    if (!error) {
                        let list;
                        list = results.map(item => {
                            let ownerItem = new ownerEntity_1.OwnerEntity();
                            ownerItem.fromMySqlDbEntity(item);
                            return ownerItem;
                        });
                        return callback(res, error, list);
                    }
                    callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.Create = (owner, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = owner.toMysqlDbEntity(true);
                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    callback(error, results);
                });
            }, error => {
                callback(error, null);
            });
        };
        this.UpdatePassword = (memberId, password, res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.updatePasswordQuery, [password, memberId], (error, results) => {
                    callback(res, error, null);
                });
                console.log(query);
            }, error => {
                callback(res, error, null);
            });
        };
        this.UpdateOwner = (owner, res, callback) => {
            this.connDb.Connect(connection => {
                const dbOwner = owner.toMysqlDbEntity(false);
                const query = connection.query(this.updateQuery, [dbOwner, owner.id], (error, results) => {
                    callback(res, error, results);
                });
                console.log(query);
            }, error => {
                callback(res, error, null);
            });
        };
    }
    GetOwner(id, res, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.getOwnerQuery, id, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new ownerEntity_1.OwnerEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    return callback(res, error, ownerItem);
                }
                callback(res, error, results);
            });
        }, error => {
            callback(res, error, null);
        });
    }
    GetOwnerByEmail(email, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.getOwnerByEmailQuery, email, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new ownerEntity_1.OwnerEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    return callback(error, ownerItem);
                }
                callback(error, null);
            });
            console.log(query.sql);
        }, error => {
            callback(error, null);
        });
    }
    DeleteOwner(id, res, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.deleteOwnerQuery, id, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new ownerEntity_1.OwnerEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    return callback(res, error, ownerItem);
                }
                callback(res, error, null);
            });
            console.log(query.sql);
        }, error => {
            callback(res, error, null);
        });
    }
}
exports.OwnerDAO = OwnerDAO;
//# sourceMappingURL=ownerDAO.js.map