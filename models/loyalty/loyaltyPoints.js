"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class LoyaltyPointsEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.Id = 0;
        this.ProgramId = 0;
        this.PointDate = new Date();
    }
    static GetInstance() {
        const instance = new LoyaltyPointsEntity();
        instance.PointDate = new Date();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        return {
            PROGRAM_ID: this.ProgramId,
            POINTS_DATE: this.PointDate
        };
    }
    fromMySqlDbEntity(dbentity) {
        this.Id = dbentity.ID;
        this.PointDate = dbentity.POINTS_DATE;
        this.ProgramId = dbentity.PROGRAM_ID;
    }
}
exports.LoyaltyPointsEntity = LoyaltyPointsEntity;
//# sourceMappingURL=loyaltyPoints.js.map