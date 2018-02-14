"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class LoyaltyUsageType extends base_model_1.BaseEntity {
    static getInstance() {
        const instance = new LoyaltyUsageType();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                ID: this.id,
                USAGE_GOAL: this.usageGoal,
                USAGE_REWARD: this.usageReward
            };
        }
        else {
            return {
                USAGE_GOAL: this.usageGoal,
                USAGE_REWARD: this.usageReward
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.id = dbentity.ID;
        this.usageGoal = dbentity.USAGE_GOAL;
        this.usageReward = dbentity.USAGE_REWARD;
    }
}
exports.LoyaltyUsageType = LoyaltyUsageType;
//# sourceMappingURL=loyaltyUsageType.js.map