"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
const loyalty_1 = require("../../models/loyalty/loyalty");
const loyaltyValidity_1 = require("../../models/loyalty/loyaltyValidity");
const loyaltyUsageType_1 = require("../../models/loyalty/loyaltyUsageType");
class LoyaltyDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.insertQuery = "INSERT INTO LOYALTY SET ?";
        this.insertUsageQuery = "INSERT INTO LOYALTY_USAGE_TYPE SET ?";
        this.insertValidityQuery = "INSERT INTO LOYALTY_VALIDITY (LOYALTY_ID, WEEKDAY, STARTTIME, ENDTIME) VALUES ?";
        this.listQuery = "SELECT * FROM LOYALTY";
        this.listByOwnerQuery = "SELECT * FROM LOYALTY WHERE OWNER_ID = ?";
        this.listByOwnerStatusQuery = "SELECT * FROM LOYALTY WHERE STATUS = ? AND OWNER_ID = ?";
        this.getLoyaltyQuery = "SELECT L.*, LU.* FROM LOYALTY L, LOYALTY_USAGE_TYPE LU WHERE L.ID = ? AND L.ID = LU.ID";
        this.getLoyaltyValidity = "SELECT * FROM LOYALTY_VALIDITY WHERE LOYALTY_ID = ?";
        this.deleteLoyaltyQuery = "DELETE FROM LOYALTY WHERE ID = ?";
        this.deleteLoyaltyValidityQuery = "DELETE FROM LOYALTY_VALIDITY WHERE LOYALTY_ID = ?";
        this.updateQuery = "UPDATE LOYALTY SET ? WHERE ID= ?";
        this.updateUsageQuery = "UPDATE LOYALTY_USAGE_TYPE SET ? WHERE ID = ?";
        this.changeStatusQuery = "UPDATE LOYALTY SET STATUS = ? WHERE ID = ?";
        this.ListLoyalty = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.listByOwnerQuery, ownerId, (error, results) => {
                    if (!error) {
                        let list;
                        list = results.map(item => {
                            let ownerItem = new loyalty_1.LoyaltyEntity();
                            ownerItem.fromMySqlDbEntity(item);
                            return ownerItem;
                        });
                        connection.release();
                        return callback(res, error, list);
                    }
                    connection.release();
                    return callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.ListLoyaltyStatus = (ownerId, status, res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.listByOwnerStatusQuery, [status, ownerId], (error, results) => {
                    if (!error) {
                        let list;
                        list = results.map(item => {
                            let ownerItem = new loyalty_1.LoyaltyEntity();
                            ownerItem.fromMySqlDbEntity(item);
                            return ownerItem;
                        });
                        connection.release();
                        return callback(res, error, list);
                    }
                    connection.release();
                    return callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.Create = (loyalty, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = loyalty.toMysqlDbEntity(true);
                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    if (!error) {
                        loyalty.usageType.id = results.insertId;
                        const dbUsage = loyalty.usageType.toMysqlDbEntity(true);
                        connection.query(this.insertUsageQuery, dbUsage, (err, result) => {
                            if (!err) {
                                if (loyalty.validity && loyalty.validity.length > 0) {
                                    const dbValidities = new Array();
                                    loyalty.validity.forEach(item => {
                                        item.loyaltyId = results.insertId;
                                        dbValidities.push([
                                            item.loyaltyId,
                                            item.weekday,
                                            item.startTime,
                                            item.endTime
                                        ]);
                                    });
                                    const qi = connection.query(this.insertValidityQuery, [dbValidities], (e, ret) => {
                                        if (e) {
                                            this.DeleteLoyalty(results.insertId, null);
                                        }
                                        connection.release();
                                        return callback(e, results);
                                    });
                                }
                                else {
                                    connection.release();
                                    return callback(err, results);
                                }
                            }
                            else {
                                this.DeleteLoyalty(results.insertId, null);
                                connection.release();
                                return callback(err, results);
                            }
                        });
                    }
                    else {
                        connection.release();
                        return callback(error, results);
                    }
                });
            }, error => {
                return callback(error, null);
            });
        };
        this.UpdateLoyalty = (loyalty, callback) => {
            this.connDb.Connect(connection => {
                const dbLoyalty = loyalty.toMysqlDbEntity(false);
                const query = connection.query(this.updateQuery, [dbLoyalty, loyalty.id], (error, results) => {
                    if (!error) {
                        const dbUsage = loyalty.usageType.toMysqlDbEntity(false);
                        connection.query(this.updateUsageQuery, [dbUsage, loyalty.usageType.id], (err, result) => {
                            if (!err) {
                                if (loyalty.validity && loyalty.validity.length > 0) {
                                    connection.query(this.deleteLoyaltyValidityQuery, loyalty.id, (er, rest) => {
                                        if (!er) {
                                            const dbValidities = new Array();
                                            loyalty.validity.forEach(item => {
                                                dbValidities.push([
                                                    item.loyaltyId,
                                                    item.weekday,
                                                    item.startTime,
                                                    item.endTime
                                                ]);
                                            });
                                            const qi = connection.query(this.insertValidityQuery, [dbValidities], (e, ret) => {
                                                connection.release();
                                                return callback(e, results);
                                            });
                                        }
                                        else {
                                            connection.release();
                                            return callback(er, results);
                                        }
                                    });
                                }
                                else {
                                    connection.release();
                                    return callback(err, results);
                                }
                            }
                            else {
                                connection.release();
                                return callback(err, results);
                            }
                        });
                    }
                    else {
                        connection.release();
                        return callback(error, results);
                    }
                });
            }, error => {
                callback(error, null);
            });
        };
        this.UpdateLoyaltyStatus = (loyaltyId, status, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.changeStatusQuery, [status, loyaltyId], (error, results) => {
                    connection.release();
                    callback(error, results);
                });
            }, error => {
                callback(error, null);
            });
        };
    }
    GetLoyalty(id, res, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.getLoyaltyQuery, id, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new loyalty_1.LoyaltyEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    ownerItem.usageType = loyaltyUsageType_1.LoyaltyUsageType.getInstance();
                    ownerItem.usageType.fromMySqlDbEntity(results[0]);
                    connection.query(this.getLoyaltyValidity, id, (err, result) => {
                        if (!error && result.length > 0) {
                            ownerItem.validity = result.map(item => {
                                let validity = loyaltyValidity_1.LoyaltyValidity.getInstance();
                                validity.fromMySqlDbEntity(item);
                                return validity;
                            });
                            connection.release();
                            return callback(res, err, ownerItem);
                        }
                        else {
                            connection.release();
                            return callback(res, err, ownerItem);
                        }
                    });
                }
                else {
                    connection.release();
                    return callback(res, error, results);
                }
            });
        }, error => {
            return callback(res, error, null);
        });
    }
    DeleteLoyalty(id, callback, res) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.deleteLoyaltyQuery, id, (error, results) => {
                if (!error) {
                    connection.release();
                    if (callback)
                        return callback(error, results);
                }
                else {
                    connection.release();
                    if (callback)
                        return callback(error, null);
                }
            });
        }, error => {
            callback(res, error, null);
        });
    }
}
exports.LoyaltyDAO = LoyaltyDAO;
//# sourceMappingURL=loyaltyDAO.js.map