"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passgen = require("generate-password");
const md5_1 = require("ts-md5/dist/md5");
const cloudinary = require("cloudinary");
const mailchimp = require("mailchimp-api-v3");
const base_controller_1 = require("./base.controller");
const ownerDAO_1 = require("./../dataaccess/owner/ownerDAO");
const ownerEntity_1 = require("./../models/owner/ownerEntity");
const ownerErrors_1 = require("../config/errors/ownerErrors");
const serviceResult_model_1 = require("../models/serviceResult.model");
const genericErrors_1 = require("./../config/errors/genericErrors");
class OwnerController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.dataAccess = new ownerDAO_1.OwnerDAO();
        this.listOwners = (req, res) => {
            req.checkParams("cityId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                this.dataAccess.ListOwners(res, this.processDefaultResult);
            }
            else {
                const cityId = req.params["cityId"];
                this.dataAccess.ListCityOwners(cityId, res, this.processDefaultResult);
            }
        };
        this.getOwner = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["id"];
            this.dataAccess.GetOwner(ownerId, res, this.processDefaultResult);
        };
        this.createOwner = (req, res) => {
            if (req.body == null || req.body == undefined) {
                return res.json(genericErrors_1.GenericErrorsProvider.GetError(genericErrors_1.EGenericErrors.InvalidArguments));
            }
            req.checkBody({
                title: {
                    notEmpty: true,
                    errorMessage: "Título é Obrigatório"
                },
                ownerName: {
                    notEmpty: true,
                    errorMessage: "Nome do responsável é Obrigatório"
                },
                email: {
                    isEmail: true,
                    errorMessage: "E-mail inválido ou vazio"
                },
                ondeIrId: {
                    exists: true,
                    errorMessage: "Necessário um relacionamento com um estabelecimento do Onde Ir"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerRequiredParams, errors));
            }
            let owner = ownerEntity_1.OwnerEntity.getInstance();
            owner.Map(req.body);
            const password = passgen.generate({ length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true });
            const originalPassword = password;
            owner.password = md5_1.Md5.hashStr(password).toString();
            const imageLogo = owner.logo;
            owner.logo = "";
            this.dataAccess.Create(owner, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('IDX_OWNER_EMAIL') >= 0) {
                        return res.json(ownerErrors_1.OwnerErrorsProvider.GetError(ownerErrors_1.EOwnerErrors.EmailAlreadyExists));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                const mail = new mailchimp(process.env.MAILCHIMP_KEY);
                mail.post('/lists/7e0195b430/members', {
                    email_address: owner.email,
                    status: 'subscribed',
                    merge_fields: {
                        FNAME: owner.ownerName,
                        PASSWORD: originalPassword,
                        CELLPHONE: owner.cellphone,
                        PLACE: owner.title
                    }
                });
                if (imageLogo && imageLogo.length > 0) {
                    cloudinary.config({
                        cloud_name: 'ondeirfidelidade',
                        api_key: process.env.CLOUDNARY_KEY,
                        api_secret: process.env.CLOUDNARY_SECRET
                    });
                    cloudinary.uploader.upload(imageLogo, (ret) => {
                        if (ret) {
                            owner.id = result.insertId;
                            owner.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg");
                            return this.dataAccess.UpdateOwner(owner, res, this.processDefaultResult);
                        }
                        else {
                            return res.json(ownerErrors_1.OwnerErrorsProvider.GetError(ownerErrors_1.EOwnerErrors.LogoUploadError));
                        }
                    });
                }
                else {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                }
            });
        };
        this.updateOwner = (req, res) => {
            req.checkBody({
                title: {
                    notEmpty: true,
                    errorMessage: "Título é Obrigatório"
                },
                ownerName: {
                    notEmpty: true,
                    errorMessage: "Nome do responsável é Obrigatório"
                },
                email: {
                    isEmail: true,
                    errorMessage: "E-mail inválido ou vazio"
                },
                ondeIrId: {
                    exists: true,
                    errorMessage: "Necessário um relacionamento com um estabelecimento do Onde Ir"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerRequiredParams, errors));
            }
            let owner = ownerEntity_1.OwnerEntity.getInstance();
            owner.Map(req.body);
            let imageLogo = owner.logo;
            if (imageLogo.indexOf("http") >= 0) {
                imageLogo = "";
            }
            if (imageLogo && imageLogo.length > 0) {
                cloudinary.config({
                    cloud_name: 'ondeirfidelidade',
                    api_key: '489546737959678',
                    api_secret: 'alml7Ms_FyyBRkJ90sUbxWqLF1Q'
                });
                cloudinary.uploader.upload(imageLogo, (ret) => {
                    if (ret) {
                        owner.logo = ret.url.replace("/image/upload", "/image/upload/t_fidelidadeimages").replace(".png", ".jpg");
                        return this.dataAccess.UpdateOwner(owner, res, this.processDefaultResult);
                    }
                    else {
                        return res.json(ownerErrors_1.OwnerErrorsProvider.GetError(ownerErrors_1.EOwnerErrors.LogoUploadError));
                    }
                });
            }
            else {
                return this.dataAccess.UpdateOwner(owner, res, this.processDefaultResult);
            }
        };
        this.updatePassword = (req, res) => {
            req.checkBody({
                memberId: {
                    notEmpty: true,
                    errorMessage: "Código é Obrigatório"
                },
                password: {
                    notEmpty: true,
                    errorMessage: "Nova Senha é Obrigatório"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerRequiredParams, errors));
            }
            const reqObj = req.body;
            this.dataAccess.UpdatePassword(reqObj.memberId, reqObj.password, res, this.processDefaultResult);
        };
        this.deleteOwner = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["id"];
            this.dataAccess.DeleteOwner(ownerId, res, this.processDefaultResult);
        };
        this.resetPassword = (req, res) => {
            req.checkBody("email").isEmail();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(ownerErrors_1.OwnerErrorsProvider.GetErrorDetails(ownerErrors_1.EOwnerErrors.InvalidOwnerRequiredParams, errors));
            }
            const email = req.body.email;
            this.dataAccess.GetOwnerByEmail(email, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (ret) {
                    const password = passgen.generate({ length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true });
                    const originalPassword = password;
                    const newPassword = md5_1.Md5.hashStr(password).toString();
                    this.dataAccess.UpdatePassword(ret.id, newPassword, res, this.processDefaultResult);
                }
                else {
                    return res.json(ownerErrors_1.OwnerErrorsProvider.GetError(ownerErrors_1.EOwnerErrors.EmailNotFound));
                }
            });
        };
    }
}
exports.OwnerController = OwnerController;
//# sourceMappingURL=owner.controller.js.map