"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
class ReportsDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.getLoyaltiesNumberQuery = "SELECT COUNT(1) AS ITEMS FROM LOYALTY";
        this.getOffersNumberQuery = "SELECT COUNT(1) AS ITEMS FROM OFFERS";
        this.getCouponsNumberQuery = `SELECT COUNT(1) AS ITEMS FROM COUPONS C, OFFERS O
                                    WHERE C.OFFER_ID = O.ID`;
        this.getClientsNumberQuery = `SELECT COUNT(1) AS ITEMS FROM LOYALTY_PROGRAMS LP, LOYALTY L
                                    WHERE LP.LOYALTY_ID = L.ID`;
        this.GetLoyaltyNumber = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                let query = this.getLoyaltiesNumberQuery;
                if (ownerId > 0) {
                    query = query + " WHERE OWNER_ID = ?";
                }
                connection.query(query, ownerId, (error, results) => {
                    if (!error && results && results.length > 0) {
                        return callback(res, error, results[0].ITEMS);
                    }
                    callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.GetOffersNumber = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                let query = this.getOffersNumberQuery;
                if (ownerId > 0) {
                    query = query + " WHERE OWNER_ID = ?";
                }
                connection.query(query, ownerId, (error, results) => {
                    if (!error && results && results.length > 0) {
                        return callback(res, error, results[0].ITEMS);
                    }
                    callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.GetProgramsNumber = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                let query = this.getClientsNumberQuery;
                if (ownerId > 0) {
                    query = query + " AND L.OWNER_ID = ?";
                }
                connection.query(query, ownerId, (error, results) => {
                    if (!error && results && results.length > 0) {
                        return callback(res, error, results[0].ITEMS);
                    }
                    callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
        this.GetCouponsNumber = (ownerId, res, callback) => {
            this.connDb.Connect(connection => {
                let query = this.getCouponsNumberQuery;
                if (ownerId > 0) {
                    query = query + " AND O.OWNER_ID = ?";
                }
                connection.query(query, ownerId, (error, results) => {
                    if (!error && results && results.length > 0) {
                        return callback(res, error, results[0].ITEMS);
                    }
                    callback(res, error, results);
                });
            }, error => {
                callback(res, error, null);
            });
        };
    }
}
exports.ReportsDAO = ReportsDAO;
//# sourceMappingURL=reportsDAO.js.map