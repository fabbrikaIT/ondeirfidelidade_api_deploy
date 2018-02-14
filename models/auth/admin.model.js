"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class AdminEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.name = "";
        this.email = "";
        this.city = "";
        this.password = "";
    }
}
exports.AdminEntity = AdminEntity;
//# sourceMappingURL=admin.model.js.map