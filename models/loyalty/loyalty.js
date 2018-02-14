"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ownerEntity_1 = require("./../owner/ownerEntity");
const base_model_1 = require("../base.model");
const loyaltyUsageType_1 = require("./loyaltyUsageType");
var ELoyaltyStatus;
(function (ELoyaltyStatus) {
    ELoyaltyStatus[ELoyaltyStatus["Pendent"] = 1] = "Pendent";
    ELoyaltyStatus[ELoyaltyStatus["Active"] = 2] = "Active";
    ELoyaltyStatus[ELoyaltyStatus["Cancelled"] = 3] = "Cancelled";
    ELoyaltyStatus[ELoyaltyStatus["Finish"] = 4] = "Finish";
})(ELoyaltyStatus = exports.ELoyaltyStatus || (exports.ELoyaltyStatus = {}));
class LoyaltyEntity extends base_model_1.BaseEntity {
    static getInstance() {
        const instance = new LoyaltyEntity();
        instance.status = ELoyaltyStatus.Pendent;
        instance.validity = new Array();
        instance.type = 1;
        instance.usageType = loyaltyUsageType_1.LoyaltyUsageType.getInstance();
        instance.owner = ownerEntity_1.OwnerEntity.getInstance();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                NAME: this.name,
                START_DATE: this.startDate,
                END_DATE: this.endDate,
                TYPE: this.type,
                OWNER_ID: this.ownerId,
                DAY_LIMIT: this.dayLimit,
                USAGE_LIMIT: this.usageLimit,
                STATUS: this.status,
                QR_HASH: this.qrHash
            };
        }
        else {
            return {
                NAME: this.name,
                START_DATE: this.startDate,
                END_DATE: this.endDate,
                TYPE: this.type,
                DAY_LIMIT: this.dayLimit,
                USAGE_LIMIT: this.usageLimit
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.id = dbentity.ID;
        this.name = dbentity.NAME;
        this.startDate = dbentity.START_DATE;
        this.endDate = dbentity.END_DATE;
        this.type = dbentity.TYPE;
        this.ownerId = dbentity.OWNER_ID;
        this.dayLimit = dbentity.DAY_LIMIT;
        this.usageLimit = dbentity.USAGE_LIMIT;
        this.status = dbentity.STATUS;
        this.qrHash = dbentity.QR_HASH;
    }
}
exports.LoyaltyEntity = LoyaltyEntity;
//# sourceMappingURL=loyalty.js.map