"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const coupon_model_1 = require("./../../models/offers/coupon.model");
const baseDAO_1 = require("../baseDAO");
const offers_model_1 = require("../../models/offers/offers.model");
const ownerEntity_1 = require("../../models/owner/ownerEntity");
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
        this.searchOffersByCityQuery = `SELECT O.* FROM OFFERS O
                                                WHERE O.STATUS = 1
                                                AND O.STARTDATE <= SYSDATE()
                                                AND (O.ENDDATE IS NULL OR O.ENDDATE >= SYSDATE())
                                                AND EXISTS (SELECT 1 FROM OWNER OW
                                                                        WHERE OW.ID = O.OWNER_ID
                                                                            AND OW.ONDE_IR_CITY = ?)`;
        this.getUserOfferCoupomQuery = `SELECT C.ID, O.ID AS OFFER_ID, C.USER_ID, C.COUPON_LINK, C.IS_VALID, O.TITLE, O.STARTDATE, 
                                                      O.ENDDATE, O.TYPE, O.DISCOUNT, O.REWARD, O.DESCRIPTION, O.RESTRICTIONS, O.OWNER_ID
                                                FROM COUPONS C, OFFERS O
                                            WHERE C.OFFER_ID = O.ID
                                                AND C.OFFER_ID = ?
                                                AND EXISTS (SELECT 1 FROM USERS U
                                                            WHERE U.ID = C.USER_ID
                                                                AND U.ONDE_IR_ID = ?)`;
        this.createCouponQuery = `INSERT INTO COUPONS SET ?`;
        this.updateCouponQuery = `UPDATE COUPONS SET ? WHERE ID = ?`;
        this.listUserCouponsQuery = `SELECT C.ID AS COUPON_ID, OF.ID, OF.TITLE, OF.STARTDATE, OF.ENDDATE, OF.TYPE, OF.DISCOUNT, OF.REWARD,
                                                    OF.DESCRIPTION, OF.RESTRICTIONS, OF.QR_HASH
                                                FROM COUPONS C, OFFERS OF
                                                WHERE C.OFFER_ID = OF.ID
                                                AND C.IS_VALID = 0
                                                AND EXISTS (SELECT 1 FROM USERS U
                                                            WHERE U.ID = C.USER_ID
                                                            AND U.ONDE_IR_ID = ?)`;
        this.getUserOfferHashQuery = `SELECT O.ID, O.TITLE, O.STARTDATE, O.ENDDATE, O.TYPE, O.DISCOUNT, O.REWARD, 
                                                    O.DESCRIPTION, O.RESTRICTIONS, O.OWNER_ID, OW.TITLE, OW.REGISTER_DATE, OW.OWNER_NAME,
                                                    OW.EMAIL, OW.CELLPHONE, OW.LOGO
                                                FROM COUPONS C, OFFERS O, OWNER OW
                                                WHERE C.OFFER_ID = O.ID
                                                AND O.OWNER_ID = OW.ID
                                                AND O.QR_HASH = ?
                                                AND EXISTS (SELECT 1 FROM USERS U
                                                        WHERE U.ID = C.USER_ID
                                                            AND U.ONDE_IR_ID = ?)`;
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
        this.SearchOffersByCity = (cityId, res, callback) => {
            this.connDb.Connect(connection => {
                connection.query(this.searchOffersByCityQuery, cityId, (error, results) => {
                    if (!error && results.length > 0) {
                        let list;
                        list = results.map(item => {
                            let offerItem = new offers_model_1.OffersEntity();
                            offerItem.fromMySqlDbEntity(item);
                            return offerItem;
                        });
                        connection.release();
                        return callback(res, error, list);
                    }
                    else {
                        connection.release();
                        return callback(res, error, null);
                    }
                });
            }, error => {
                return callback(res, error, null);
            });
        };
        this.GetUserCouponOffer = (userId, offerId, callback) => {
            this.connDb.Connect(connection => {
                connection.query(this.getUserOfferCoupomQuery, [offerId, userId], (error, results) => {
                    if (!error) {
                        if (results.length === 0) {
                            connection.release();
                            return callback(null, null);
                        }
                        else {
                            let list;
                            list = results.map(item => {
                                let couponItem = new coupon_model_1.CouponEntity();
                                couponItem.fromMySqlDbEntity(item);
                                couponItem.offer = offers_model_1.OffersEntity.getInstance();
                                couponItem.offer.fromMySqlDbEntity(item);
                                return couponItem;
                            });
                            connection.release();
                            return callback(error, list);
                        }
                    }
                    else {
                        connection.release();
                        return callback(error, null);
                    }
                });
            }, error => {
                return callback(error, null);
            });
        };
        this.GetUserCouponOfferHash = (qrHash, userId, res, callback) => {
            this.connDb.Connect(connection => {
                connection.query(this.getUserOfferHashQuery, [qrHash, userId], (error, results) => {
                    if (!error) {
                        if (results.length === 0) {
                            connection.release();
                            return callback(null, null);
                        }
                        else {
                            let offerItem = offers_model_1.OffersEntity.getInstance();
                            offerItem.fromMySqlDbEntity(results[0]);
                            offerItem.owner = ownerEntity_1.OwnerEntity.getInstance();
                            offerItem.owner.fromMySqlDbEntity(results[0]);
                            connection.release();
                            return callback(res, error, offerItem);
                        }
                    }
                    else {
                        connection.release();
                        return callback(error, null);
                    }
                });
            }, error => {
                return callback(error, null);
            });
        };
        this.CreateCoupon = (coupon, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = coupon.toMysqlDbEntity(true);
                connection.query(this.createCouponQuery, dbEntity, (error, results) => {
                    connection.release();
                    return callback(error, results);
                });
            }, error => {
                return callback(error, null);
            });
        };
        this.ListUserCoupons = (userId, res, callback) => {
            this.connDb.Connect(connection => {
                connection.query(this.listUserCouponsQuery, userId, (error, results) => {
                    if (!error && results.length > 0) {
                        let list;
                        list = results.map(item => {
                            let offerItem = new offers_model_1.OffersEntity();
                            offerItem.fromMySqlDbEntity(item);
                            return offerItem;
                        });
                        connection.release();
                        return callback(res, error, list);
                    }
                    else {
                        connection.release();
                        return callback(res, error, null);
                    }
                });
            }, error => {
                return callback(error, null);
            });
        };
        this.UseCoupon = (coupon, res, callback) => {
            this.connDb.Connect(connection => {
                const dbEntity = coupon.toMysqlDbEntity(false);
                connection.query(this.updateCouponQuery, [dbEntity, coupon.id], (error, results) => {
                    connection.release();
                    return callback(res, error, results);
                });
            }, error => {
                return callback(error, null);
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
                    return callback(res, error, null);
                }
            });
        }, error => {
            return callback(res, error, null);
        });
    }
}
exports.OffersDAO = OffersDAO;
//# sourceMappingURL=offersDAO.js.map