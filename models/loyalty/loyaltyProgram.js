"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class LoyaltyProgramEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.Id = 0;
        this.UserId = 0;
        this.LoyaltyId = 0;
        this.RegisterDate = new Date();
        this.Discharges = 0;
        this.CardLink = "";
    }
    static GetInstance() {
        const instance = new LoyaltyProgramEntity();
        instance.Points = new Array();
        instance.RegisterDate = new Date();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                USER_ID: this.UserId,
                LOYALTY_ID: this.LoyaltyId,
                REGISTER_DATE: this.RegisterDate,
                DISCHARGE: 0,
                CARD_LINK: this.CardLink
            };
        }
        else {
            return {
                DISCHARGE: this.Discharges,
                CARD_LINK: this.CardLink
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.Id = dbentity.ID;
        this.CardLink = dbentity.CARD_LINK;
        this.Discharges = dbentity.DISCHARGE;
        this.RegisterDate = dbentity.REGISTER_DATE;
        this.LoyaltyId = dbentity.LOYALTY_ID;
        this.UserId = dbentity.USER_ID;
    }
}
exports.LoyaltyProgramEntity = LoyaltyProgramEntity;
//# sourceMappingURL=loyaltyProgram.js.map