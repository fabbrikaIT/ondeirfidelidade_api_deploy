"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class UserEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.Id = 0;
        this.OndeIrId = 0;
        this.Name = "";
        this.Email = "";
        this.OndeIrCity = 0;
    }
    static GetInstance() {
        const instance = new UserEntity();
        return instance;
    }
    toMysqlDbEntity(isNew) {
        if (isNew) {
            return {
                ONDE_IR_ID: this.OndeIrId,
                NAME: this.Name,
                E_MAIL: this.Email,
                ONDE_IR_CITY: this.OndeIrCity
            };
        }
        else {
            return {
                NAME: this.Name,
                E_MAIL: this.Email,
                ONDE_IR_CITY: this.OndeIrCity
            };
        }
    }
    fromMySqlDbEntity(dbentity) {
        this.Id = dbentity.ID;
        this.Name = dbentity.NAME;
        this.Email = dbentity.E_MAIL;
        this.OndeIrId = dbentity.ONDE_IR_ID;
        this.OndeIrCity = dbentity.ONDE_IR_CITY;
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=userEntity.js.map