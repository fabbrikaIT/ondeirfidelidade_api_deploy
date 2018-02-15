"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passgen = require("generate-password");
const md5_1 = require("ts-md5/dist/md5");
const loyaltyDAO_1 = require("./../dataaccess/loyalty/loyaltyDAO");
const base_controller_1 = require("./base.controller");
const serviceResult_model_1 = require("../models/serviceResult.model");
const loyaltyErrors_1 = require("../config/errors/loyaltyErrors");
const loyalty_1 = require("../models/loyalty/loyalty");
const loyaltyUsageType_1 = require("./../models/loyalty/loyaltyUsageType");
const loyaltyValidity_1 = require("./../models/loyalty/loyaltyValidity");
const ownerDAO_1 = require("../dataaccess/owner/ownerDAO");
class LoyaltyController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.dataAccess = new loyaltyDAO_1.LoyaltyDAO();
        this.ListLoyalty = (req, res) => {
            req.checkParams("owner").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["owner"];
            this.dataAccess.ListLoyalty(ownerId, res, this.processDefaultResult);
        };
        this.ListLoyaltyStatus = (req, res) => {
            req.checkParams("owner").isNumeric();
            req.checkParams("status").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["owner"];
            const status = req.params["status"];
            this.dataAccess.ListLoyaltyStatus(ownerId, status, res, this.processDefaultResult);
        };
        this.GetLoyalty = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const id = req.params["id"];
            this.dataAccess.GetLoyalty(id, res, (r, err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!result || result.length === 0) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                }
                const ownerAccess = new ownerDAO_1.OwnerDAO();
                ownerAccess.GetOwner(result.ownerId, res, (r, er, ret) => {
                    if (er) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(er));
                    }
                    result.owner = ret;
                    const serviceResult = serviceResult_model_1.ServiceResult.HandlerSucess();
                    serviceResult.Result = result;
                    res.json(serviceResult);
                });
            });
        };
        this.CreateLoyalty = (req, res) => {
            req.checkBody({
                name: {
                    notEmpty: true,
                    errorMessage: "Nome do programa de fidelidade é Obrigatório"
                },
                startDate: {
                    notEmpty: true,
                    errorMessage: "Data de inicio do programa de fidelidade é obrigatória"
                },
                type: {
                    isNumeric: true,
                    errorMessage: "Tipo de programa inválido"
                },
                ownerId: {
                    isNumeric: true,
                    errorMessage: "Código de cliente inválido"
                },
                usageType: {
                    exists: true,
                    errorMessage: "Dados de recompensa de fidelidade inválidos"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyRequiredParams, errors));
            }
            let loyalty = loyalty_1.LoyaltyEntity.getInstance();
            loyalty.Map(req.body);
            loyalty.usageType = loyaltyUsageType_1.LoyaltyUsageType.getInstance();
            loyalty.usageType.Map(req.body.usageType);
            if (req.body.validity) {
                loyalty.validity = req.body.validity.map(item => {
                    let validity = loyaltyValidity_1.LoyaltyValidity.getInstance();
                    validity.Map(item);
                    return validity;
                });
            }
            if (loyalty.type !== 1 && loyalty.type !== 2) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyType, errors));
            }
            if (loyalty.type == 2) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.NotImplementedLoyaltyType, errors));
            }
            const id = passgen.generate({ length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true });
            loyalty.qrHash = md5_1.Md5.hashStr(id).toString();
            this.dataAccess.Create(loyalty, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_OWNER_LOYALTY') >= 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.OwnerNotFound));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            });
        };
        this.UpdateLoyalty = (req, res) => {
            req.checkBody({
                id: {
                    isNumeric: true,
                    errorMessage: "Id do programa de fidelidade é Obrigatório"
                },
                name: {
                    notEmpty: true,
                    errorMessage: "Nome do programa de fidelidade é Obrigatório"
                },
                startDate: {
                    notEmpty: true,
                    errorMessage: "Data de inicio do programa de fidelidade é obrigatória"
                },
                type: {
                    isNumeric: true,
                    errorMessage: "Tipo de programa inválido"
                },
                ownerId: {
                    isNumeric: true,
                    errorMessage: "Código de cliente inválido"
                },
                usageType: {
                    exists: true,
                    errorMessage: "Dados de recompensa de fidelidade inválidos"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyRequiredParams, errors));
            }
            let loyalty = loyalty_1.LoyaltyEntity.getInstance();
            loyalty.Map(req.body);
            loyalty.usageType = loyaltyUsageType_1.LoyaltyUsageType.getInstance();
            loyalty.usageType.Map(req.body.usageType);
            if (req.body.validity) {
                loyalty.validity = req.body.validity.map(item => {
                    let validity = loyaltyValidity_1.LoyaltyValidity.getInstance();
                    validity.Map(item);
                    validity.loyaltyId = loyalty.id;
                    return validity;
                });
            }
            this.dataAccess.UpdateLoyalty(loyalty, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_OWNER_LOYALTY') >= 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.OwnerNotFound));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                else {
                    if (result.affectedRows == 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            });
        };
        this.DeleteLoyalty = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const id = req.params["id"];
            this.dataAccess.DeleteLoyalty(id, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_LOYALTY_PROGRAM') >= 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.ProgramWithParticipants));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            }, res);
        };
        this.ActivateLoyalty = (req, res) => {
            req.checkBody("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const id = req.body.id;
            this.dataAccess.UpdateLoyaltyStatus(id, loyalty_1.ELoyaltyStatus.Active, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                else {
                    if (ret.affectedRows == 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                    }
                    res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                }
            });
        };
        this.DeactivateLoyalty = (req, res) => {
            req.checkBody("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const id = req.body.id;
            this.dataAccess.UpdateLoyaltyStatus(id, loyalty_1.ELoyaltyStatus.Cancelled, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                else {
                    if (ret.affectedRows == 0) {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                    }
                    res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                }
            });
        };
        this.ApplyLoyalty = (req, res) => {
            res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
        };
    }
}
exports.LoyaltyController = LoyaltyController;
//# sourceMappingURL=loyalty.controller.js.map