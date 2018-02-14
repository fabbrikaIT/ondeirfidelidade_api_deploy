"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = require("../base.model");
class AuthEntity extends base_model_1.BaseEntity {
    constructor() {
        super(...arguments);
        this.loginAccept = false;
        this.userName = "";
        this.authenticationToken = "";
        this.userId = 0;
        this.type = 1;
    }
}
exports.AuthEntity = AuthEntity;
//# sourceMappingURL=authEntity.js.map