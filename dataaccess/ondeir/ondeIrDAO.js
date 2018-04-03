"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseDAO_1 = require("../baseDAO");
const userEntity_1 = require("../../models/users/userEntity");
const http = require("https");
class OndeIrDAO extends baseDAO_1.BaseDAO {
    constructor() {
        super();
        this.GetUser = (userId, callback) => {
            const serviceUrl = `https://appondeir.com.br/sistema/rest/get_user.php?user_id=${userId}`;
            http.get(serviceUrl, res => {
                if (res.statusCode === 200) {
                    let data = '';
                    res.on('data', (chunk) => {
                        data += chunk;
                    });
                    res.on('end', () => {
                        const serviceResult = JSON.parse(data);
                        if (serviceResult && serviceResult.user_info) {
                            const user = userEntity_1.UserEntity.GetInstance();
                            user.Name = serviceResult.user_info.full_name;
                            user.OndeIrCity = 21;
                            user.Email = serviceResult.user_info.email;
                            user.OndeIrId = serviceResult.user_info.user_id;
                            callback(null, user);
                        }
                        else {
                            callback(null, null);
                        }
                    });
                }
                else {
                    callback(res.statusMessage, null);
                }
            });
        };
    }
}
exports.OndeIrDAO = OndeIrDAO;
//# sourceMappingURL=ondeIrDAO.js.map