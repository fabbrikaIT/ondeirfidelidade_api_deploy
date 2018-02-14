"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class OwnerEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.toMysqlDbEntity = (isNew) => {
            if (isNew) {
                return {
                    ONDE_IR_ID: this.ondeIrId,
                    TITLE: this.title,
                    REGISTER_DATE: this.registerDate,
                    OWNER_NAME: this.ownerName,
                    EMAIL: this.email,
                    CELLPHONE: this.cellphone,
                    LOGO: this.logo,
                    ONDE_IR_CITY: this.city,
                    PASSWORD: this.password
                };
            }
            else {
                return {
                    ONDE_IR_ID: this.ondeIrId,
                    TITLE: this.title,
                    REGISTER_DATE: this.registerDate,
                    OWNER_NAME: this.ownerName,
                    EMAIL: this.email,
                    CELLPHONE: this.cellphone,
                    LOGO: this.logo,
                    ONDE_IR_CITY: this.city
                };
            }
        };
        this.fromMySqlDbEntity = (dbEntity) => {
            (this.id = dbEntity.ID),
                (this.ondeIrId = dbEntity.ONDE_IR_ID),
                (this.title = dbEntity.TITLE),
                (this.registerDate = dbEntity.REGISTER_DATE),
                (this.ownerName = dbEntity.OWNER_NAME),
                (this.email = dbEntity.EMAIL),
                (this.cellphone = dbEntity.CELLPHONE),
                (this.logo = dbEntity.LOGO),
                (this.city = dbEntity.ONDE_IR_CITY);
        };
    }
    static getInstance() {
        const instance = new OwnerEntity();
        instance.registerDate = new Date();
        return instance;
    }
}
exports.OwnerEntity = OwnerEntity;
//# sourceMappingURL=ownerEntity.js.map