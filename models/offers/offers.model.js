"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ownerEntity_1 = require("./../owner/ownerEntity");
const base_model_1 = require("../base.model");
var EOfferStatus;
(function (EOfferStatus) {
    EOfferStatus[EOfferStatus["Active"] = 1] = "Active";
    EOfferStatus[EOfferStatus["Inative"] = 2] = "Inative";
})(EOfferStatus = exports.EOfferStatus || (exports.EOfferStatus = {}));
class OffersEntity extends base_model_1.BaseEntity {
    static getInstance() {
        const instance = new OffersEntity();
        instance.status = EOfferStatus.Active;
        instance.discount = 0;
        instance.reward = "";
        instance.description = "";
        instance.restriction = "";
        instance.owner = ownerEntity_1.OwnerEntity.getInstance();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                TITLE: this.title,
                STARTDATE: this.startDate,
                ENDDATE: this.endDate,
                TYPE: this.type,
                OWNER_ID: this.ownerId,
                DISCOUNT: this.discount,
                REWARD: this.reward,
                STATUS: this.status,
                QR_HASH: this.qrHash,
                DESCRIPTION: this.description,
                RESTRICTIONS: this.restriction
            };
        }
        else {
            return {
                NAME: this.title,
                STARTDATE: this.startDate,
                ENDDATE: this.endDate,
                TYPE: this.type,
                DISCOUNT: this.discount,
                REWARD: this.reward,
                DESCRIPTION: this.description,
                RESTRICTIONS: this.restriction
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.id = dbentity.ID;
        this.title = dbentity.TITLE;
        this.startDate = dbentity.STARTDATE;
        this.endDate = dbentity.ENDDATE;
        this.type = dbentity.TYPE;
        this.ownerId = dbentity.OWNER_ID;
        this.discount = dbentity.DISCOUNT;
        this.reward = dbentity.REWARD;
        this.status = dbentity.STATUS;
        this.qrHash = dbentity.QR_HASH;
        this.description = dbentity.DESCRIPTION;
        this.restriction = dbentity.RESTRICTIONS;
    }
}
exports.OffersEntity = OffersEntity;
//# sourceMappingURL=offers.model.js.map