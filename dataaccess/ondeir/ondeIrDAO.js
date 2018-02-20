"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
const userEntity_1 = require("../../models/users/userEntity");
class OndeIrDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.GetUser = (userId, callback) => {
            const user = userEntity_1.UserEntity.GetInstance();
            user.Name = "Usuário Teste";
            user.OndeIrCity = 21;
            user.Email = "teste@ondeir.com.br";
            user.OndeIrId = 1;
            callback(null, user);
        };
    }
}
exports.OndeIrDAO = OndeIrDAO;
//# sourceMappingURL=ondeIrDAO.js.map