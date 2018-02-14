"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
const offers_model_1 = require("../../models/offers/offers.model");
class OffersDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.insertQuery = "INSERT INTO OFFERS SET ?";
        this.listQuery = "SELECT * FROM OFFERS";
        this.listByOwnerQuery = "SELECT * FROM OFFERS WHERE OWNER_ID = ?";
        this.listByOwnerStatusQuery = "SELECT * FROM OFFERS WHERE STATUS = ? AND OWNER_ID = ?";
        this.getOffersQuery = "SELECT O.* FROM OFFERS O WHERE O.ID = ?";
        this.deleteOffersQuery = "DELETE FROM OFFERS WHERE ID = ?";
        this.updateQuery = "UPDATE OFFERS SET ? WHERE ID= ?";
        this.updateUsageQuery = "UPDATE OFFERS_USAGE_TYPE SET ? WHERE ID = ?";
        this.changeStatusQuery = "UPDATE OFFERS SET STATUS = ? WHERE ID = ?";
        this.ListOffers = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.listByOwnerQuery, ownerId, (error, results) => {
                    if (!error) {
                        let list;
                        list = results.map(item => {
                            let ownerItem = new offers_model_1.OffersEntity();
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
        this.ListOffersStatus = (ownerId, status, res, callback) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.listByOwnerStatusQuery, [status, ownerId], (error, results) => {
                    if (!error) {
                        let list;
                        list = results.map(item => {
                            let ownerItem = new offers_model_1.OffersEntity();
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
        this.Create = (offer, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = offer.toMysqlDbEntity(true);
                const query = connection.query(this.insertQuery, dbEntity, (error, results) => {
                    connection.release();
                    return callback(error, results);
                });
            }, error => {
                callback(error, null);
            });
        };
        this.Update = (offer, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = offer.toMysqlDbEntity(true);
                const query = connection.query(this.updateQuery, [dbEntity, offer.id], (error, results) => {
                    connection.release();
                    return callback(error, results);
                });
            }, error => {
                callback(error, null);
            });
        };
        this.DeleteOffer = (id, callback, res) => {
            this.connDb.Connect(connection => {
                const query = connection.query(this.deleteOffersQuery, id, (error, results) => {
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
        };
        this.UpdateOfferStatus = (loyaltyId, status, callback) => {
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
    GetOffer(id, res, callback) {
        this.connDb.Connect(connection => {
            const query = connection.query(this.getOffersQuery, id, (error, results) => {
                if (!error && results.length > 0) {
                    let ownerItem = new offers_model_1.OffersEntity();
                    ownerItem.fromMySqlDbEntity(results[0]);
                    connection.release();
                    return callback(res, error, ownerItem);
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
}
exports.OffersDAO = OffersDAO;
//# sourceMappingURL=offersDAO.js.map