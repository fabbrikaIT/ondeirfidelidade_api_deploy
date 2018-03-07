"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const offers_model_1 = require("./offers.model");
const base_model_1 = require("../base.model");
class CouponEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.id = 0;
        this.offerId = 0;
        this.userId = 0;
        this.couponLink = "";
        this.isValid = false;
    }
    static GetInstance() {
        const instance = new CouponEntity();
        instance.offer = offers_model_1.OffersEntity.getInstance();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                OFFER_ID: this.offerId,
                USER_ID: this.userId,
                COUPON_LINK: this.couponLink,
                IS_VALID: this.isValid ? 1 : 0
            };
        }
        else {
            return {
                COUPON_LINK: this.couponLink,
                IS_VALID: this.isValid ? 1 : 0
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.id = dbentity.ID;
        this.offerId = dbentity.OFFER_ID;
        this.userId = dbentity.USER_ID;
        this.couponLink = dbentity.COUPON_LINK;
        this.isValid = dbentity.IS_VALID;
    }
}
exports.CouponEntity = CouponEntity;
//# sourceMappingURL=coupon.model.js.map