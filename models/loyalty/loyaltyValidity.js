"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
var EWeekDay;
(function (EWeekDay) {
    EWeekDay[EWeekDay["Monday"] = 1] = "Monday";
    EWeekDay[EWeekDay["Tusday"] = 2] = "Tusday";
    EWeekDay[EWeekDay["Wednesday"] = 3] = "Wednesday";
    EWeekDay[EWeekDay["Thursday"] = 4] = "Thursday";
    EWeekDay[EWeekDay["Friday"] = 5] = "Friday";
    EWeekDay[EWeekDay["Saturday"] = 6] = "Saturday";
    EWeekDay[EWeekDay["Sunday"] = 7] = "Sunday";
})(EWeekDay = exports.EWeekDay || (exports.EWeekDay = {}));
class LoyaltyValidity extends base_model_1.BaseEntity {
    static getInstance() {
        const instance = new LoyaltyValidity();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                ID: this.id,
                LOYALTY_ID: this.loyaltyId,
                WEEKDAY: this.weekday,
                STARTTIME: this.startTime,
                ENDTIME: this.endTime
            };
        }
        else {
            return {
                WEEKDAY: this.weekday,
                STARTTIME: this.startTime,
                ENDTIME: this.endTime
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.id = dbentity.ID;
        this.loyaltyId = dbentity.LOYALTY_ID;
        this.weekday = dbentity.WEEKDAY;
        this.startTime = dbentity.STARTTIME;
        this.endTime = dbentity.ENDTIME;
    }
}
exports.LoyaltyValidity = LoyaltyValidity;
//# sourceMappingURL=loyaltyValidity.js.map