"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ondeIrDAO_1 = require("./../dataaccess/ondeir/ondeIrDAO");
const authEntity_1 = require("./../models/auth/authEntity");
const serviceResult_model_1 = require("./../models/serviceResult.model");
const authErrors_1 = require("./../config/errors/authErrors");
const base_controller_1 = require("./base.controller");
const authDAO_1 = require("../dataaccess/auth/authDAO");
const authUser_1 = require("../models/auth/authUser");
const md5_1 = require("ts-md5/dist/md5");
class AuthController extends base_controller_1.BaseController {
    constructor() {
        super(...arguments);
        this.ownerAccess = new authDAO_1.AuthDAO();
        this.OwnerLogin = (req, res) => {
            let authUser = new authUser_1.AuthUserEntity();
            authUser.Map(req.body);
            if (authUser && authUser.user !== "" && authUser.password !== "") {
                authUser.password = md5_1.Md5.hashStr(authUser.password).toString();
                this.ownerAccess.Login(authUser.user, authUser.password, (ret, error) => {
                    let result = new serviceResult_model_1.ServiceResult();
                    if (error) {
                        result.ErrorCode = "ERR999";
                        result.ErrorMessage = JSON.stringify(error);
                        result.Executed = false;
                    }
                    else {
                        if (ret && ret.length > 0) {
                            const auth = new authEntity_1.AuthEntity();
                            auth.loginAccept = true;
                            auth.authenticationToken = this.GenerateAuthToken(ret[0]);
                            auth.userName = ret[0].OWNER_NAME;
                            auth.userId = ret[0].ID;
                            auth.type = 1;
                            result.Executed = true;
                            result.Result = auth;
                        }
                        else {
                            result = authErrors_1.AuthErrorsProvider.GetError(authErrors_1.EAuthErrors.UserNotFound);
                        }
                    }
                    return res.json(result);
                });
            }
            else {
                console.log("valid invalid");
                return res.json(authErrors_1.AuthErrorsProvider.GetError(authErrors_1.EAuthErrors.InvalidUserOrPassword));
            }
        };
        this.UserLogin = (req, res) => {
            const adminUser = req.body;
            if (adminUser && adminUser.user !== "" && adminUser.password !== "") {
            }
            else {
                res.json(authErrors_1.AuthErrorsProvider.GetError(authErrors_1.EAuthErrors.InvalidUserOrPassword));
            }
        };
        this.OndeIrUser = (req, res) => {
            const userid = req.params["userid"];
            if (userid > 0) {
                const dataAccess = new ondeIrDAO_1.OndeIrDAO();
                dataAccess.GetUser(userid, (err, ret) => {
                    res.json(ret);
                });
            }
            else {
                res.json(authErrors_1.AuthErrorsProvider.GetError(authErrors_1.EAuthErrors.InvalidUserOrPassword));
            }
        };
        this.GenerateAuthToken = (authUser) => {
            return '';
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map