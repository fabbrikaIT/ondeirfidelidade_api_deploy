"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loyaltyPoints_1 = require("./../models/loyalty/loyaltyPoints");
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
const usersDAO_1 = require("../dataaccess/user/usersDAO");
const userEntity_1 = require("../models/users/userEntity");
const ondeIrDAO_1 = require("../dataaccess/ondeir/ondeIrDAO");
const loyaltyProgram_1 = require("../models/loyalty/loyaltyProgram");
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
            req.checkBody("qrHash").notEmpty();
            req.checkBody("userId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const qrHash = req.body.qrHash;
            const userId = req.body.userId;
            this.dataAccess.GetLoyaltyByHash(qrHash, (err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!result) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                }
                return this.ValidateProgramIsAvaliable(result, userId, res);
            });
        };
        this.GetLoyaltyProgram = (req, res) => {
            req.checkParams("qrHash").notEmpty();
            req.checkParams("userId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const qrHash = req.params["qrHash"];
            const userId = req.params["userId"];
            this.dataAccess.GetLoyaltyByHash(qrHash, (err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!result) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotFound));
                }
                this.dataAccess.GetUserLoyaltyProgram(userId, result.id, (error, ret) => {
                    if (error) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(error));
                    }
                    const serviceResult = serviceResult_model_1.ServiceResult.HandlerSucess();
                    serviceResult.Result = ret;
                    return res.json(serviceResult);
                });
            });
        };
        this.RedeemLoyaltyAward = (req, res) => {
            req.checkBody("programId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetErrorDetails(loyaltyErrors_1.ELoyaltyErrors.InvalidLoyaltyId, errors));
            }
            const programId = req.body.programId;
            this.dataAccess.GetLoyaltyProgram(programId, (err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!result) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyProgramNotFound));
                }
                this.dataAccess.GetLoyalty(result.LoyaltyId, res, (r, error, ret) => {
                    if (error) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(error));
                    }
                    if (result.Points.length === ret.usageType.usageGoal) {
                        result.Discharges += 1;
                        return this.dataAccess.RedeemLoyaltyAward(result, res, this.processDefaultResult);
                    }
                    else {
                        return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotPointsGoal));
                    }
                });
            });
        };
        this.ValidateProgramIsAvaliable = (loyalty, userId, res) => {
            let today = new Date();
            if (loyalty.status !== loyalty_1.ELoyaltyStatus.Active) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyNotActive));
            }
            if (loyalty.startDate > today || (loyalty.endDate && loyalty.endDate < today)) {
                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyOutOfDate));
            }
            if (loyalty.validity && loyalty.validity.length > 0) {
                let validity = loyalty.validity.find(item => item.weekday === today.getDay());
                if (!validity) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyOutOfDate));
                }
                if (this.getTimeValue(validity.startTime) > this.getTimeValue(today) || this.getTimeValue(validity.endTime) < this.getTimeValue(today)) {
                    return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyOutOfDate));
                }
            }
            return this.VerifyIdUserCanLoyalty(loyalty, userId, res);
        };
        this.VerifyIdUserCanLoyalty = (loyalty, userId, res) => {
            this.dataAccess.GetUserLoyaltyProgram(userId, loyalty.id, (err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (result) {
                    if (result.Points && result.Points.length > 0) {
                        if (loyalty.usageType.usageGoal == result.Points.length) {
                            return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyPointsGoal));
                        }
                        const pointsToday = result.Points.filter(x => {
                            return result.Points[0].PointDate.toLocaleDateString() === new Date().toLocaleDateString();
                        });
                        if (loyalty.dayLimit <= pointsToday.length) {
                            return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyDayLimitExceeded));
                        }
                        const lastPoint = new Date(Math.max.apply(null, result.Points.map(x => x.PointDate)));
                        const difference = new Date() - lastPoint;
                        if (loyalty.usageLimit) {
                            if (loyalty.usageLimit >= Math.floor((difference / 1000) / 60)) {
                                return res.json(loyaltyErrors_1.LoyaltyErrorsProvider.GetError(loyaltyErrors_1.ELoyaltyErrors.LoyaltyUsageWait));
                            }
                        }
                    }
                    return this.AddLoyaltyProgramPoints(result, res);
                }
                else {
                    return this.SubscribeUserLoyalty(loyalty, userId, res);
                }
            });
        };
        this.SubscribeUserLoyalty = (loyalty, userId, res) => {
            const userDA = new usersDAO_1.UsersDAO();
            userDA.GetUserByOndeIr(userId, res, (r, err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (result) {
                    const program = loyaltyProgram_1.LoyaltyProgramEntity.GetInstance();
                    program.LoyaltyId = loyalty.id;
                    program.UserId = result.Id;
                    program.CardLink = `http://ondeircidades.com.br/fidelidade/card/${loyalty.qrHash}/${result.Id}`;
                    this.dataAccess.SubscribeUserLoyaltyProgram(program, (error, ret) => {
                        if (error) {
                            return res.json(serviceResult_model_1.ServiceResult.HandlerError(error));
                        }
                        program.Id = ret.insertId;
                        return this.AddLoyaltyProgramPoints(program, res);
                    });
                }
                else {
                    return this.RegisterNewUser(loyalty, userId, res);
                }
            });
        };
        this.RegisterNewUser = (loyalty, userId, res) => {
            const userDA = new usersDAO_1.UsersDAO();
            const ondeIrDA = new ondeIrDAO_1.OndeIrDAO();
            let user = userEntity_1.UserEntity.GetInstance();
            ondeIrDA.GetUser(userId, (err, ret) => {
                if (err || !ret) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                user = ret;
                userDA.Create(user, (err, result) => {
                    if (err) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                    this.SubscribeUserLoyalty(loyalty, userId, res);
                });
            });
        };
    }
    getTimeValue(time) {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        return Math.floor(seconds + minutes * 60 + (hours * 24 * 60));
    }
    AddLoyaltyProgramPoints(program, res) {
        const point = loyaltyPoints_1.LoyaltyPointsEntity.GetInstance();
        point.ProgramId = program.Id;
        this.dataAccess.AddLoyaltyProgramPoint(point, (err, result) => {
            if (err) {
                return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
            }
            program.Points.push(point);
            const serviceResult = serviceResult_model_1.ServiceResult.HandlerSucess();
            serviceResult.Result = program;
            return res.json(serviceResult);
        });
    }
}
exports.LoyaltyController = LoyaltyController;
//# sourceMappingURL=loyalty.controller.js.map