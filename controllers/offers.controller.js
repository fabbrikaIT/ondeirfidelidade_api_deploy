"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ownerDAO_1 = require("./../dataaccess/owner/ownerDAO");
const offers_model_1 = require("./../models/offers/offers.model");
const passgen = require("generate-password");
const md5_1 = require("ts-md5/dist/md5");
const base_controller_1 = require("./base.controller");
const offersErrors_1 = require("../config/errors/offersErrors");
const offers_model_2 = require("../models/offers/offers.model");
const offersDAO_1 = require("../dataaccess/offers/offersDAO");
const serviceResult_model_1 = require("../models/serviceResult.model");
const coupon_model_1 = require("../models/offers/coupon.model");
const usersDAO_1 = require("../dataaccess/user/usersDAO");
const ondeIrDAO_1 = require("../dataaccess/ondeir/ondeIrDAO");
const userEntity_1 = require("../models/users/userEntity");
class OffersController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.dataAccess = new offersDAO_1.OffersDAO();
        this.ListOffers = (req, res) => {
            req.checkParams("owner").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["owner"];
            this.dataAccess.ListOffers(ownerId, res, this.processDefaultResult);
        };
        this.ListOffersStatus = (req, res) => {
            req.checkParams("owner").isNumeric();
            req.checkParams("status").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOwnerId, errors));
            }
            const ownerId = req.params["owner"];
            const status = req.params["status"];
            this.dataAccess.ListOffersStatus(ownerId, status, res, this.processDefaultResult);
        };
        this.GetOffers = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOfferId, errors));
            }
            const id = req.params["id"];
            this.dataAccess.GetOffer(id, res, (r, err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!result || result.length === 0) {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OfferNotFound));
                }
                const ownerAccess = new ownerDAO_1.OwnerDAO();
                ownerAccess.GetOwner(result.ownerId, res, (r, er, ret) => {
                    if (er) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(er));
                    }
                    result.owner = ret;
                    const serviceResult = serviceResult_model_1.ServiceResult.HandlerSucess();
                    serviceResult.Result = result;
                    return res.json(serviceResult);
                });
            });
        };
        this.CreateOffer = (req, res) => {
            req.checkBody({
                title: {
                    notEmpty: true,
                    errorMessage: "Título da oferta é Obrigatório"
                },
                startDate: {
                    notEmpty: true,
                    errorMessage: "Data de inicio de validade da oferta é obrigatória"
                },
                type: {
                    isNumeric: true,
                    errorMessage: "Tipo da oferta inválido"
                },
                ownerId: {
                    isNumeric: true,
                    errorMessage: "Código de cliente inválido"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOffersRequiredParams, errors));
            }
            let offer = offers_model_2.OffersEntity.getInstance();
            offer.Map(req.body);
            if (offer.type !== 1 && offer.type !== 2) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidOfferType));
            }
            if (offer.type === 1) {
                if (offer.discount <= 0 || offer.reward === "") {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidDiscountParams));
                }
            }
            else {
                if (offer.description && offer.description === "") {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidPromotionParams));
                }
            }
            const id = passgen.generate({ length: 10, numbers: true, symbols: true, excludeSimilarCharacters: true });
            offer.qrHash = md5_1.Md5.hashStr(id).toString();
            this.dataAccess.Create(offer, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_OWNER_OFFERS') >= 0) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OwnerNotFound));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            });
        };
        this.UpdateOffer = (req, res) => {
            req.checkBody({
                id: {
                    isNumeric: true,
                    errorMessage: "Código de oferta inválido"
                },
                title: {
                    notEmpty: true,
                    errorMessage: "Título da oferta é Obrigatório"
                },
                startDate: {
                    notEmpty: true,
                    errorMessage: "Data de inicio de validade da oferta é obrigatória"
                },
                type: {
                    isNumeric: true,
                    errorMessage: "Tipo da oferta inválido"
                },
                ownerId: {
                    isNumeric: true,
                    errorMessage: "Código de cliente inválido"
                }
            });
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOffersRequiredParams, errors));
            }
            let offer = offers_model_2.OffersEntity.getInstance();
            offer.Map(req.body);
            if (offer.type !== 1 && offer.type !== 2) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidOfferType));
            }
            if (offer.type === 1) {
                if (offer.discount <= 0 || offer.reward === "") {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidDiscountParams));
                }
                offer.description = "";
            }
            else {
                if (offer.description && offer.description === "") {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.InvalidPromotionParams));
                }
                offer.discount = 0;
                offer.reward = "";
            }
            this.dataAccess.Update(offer, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_OWNER_OFFERS') >= 0) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OwnerNotFound));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            });
        };
        this.DeleteOffer = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOfferId, errors));
            }
            const id = req.params["id"];
            this.dataAccess.DeleteOffer(id, (err, result) => {
                if (err) {
                    if (err.sqlMessage.indexOf('FK_FK_OFFERS_COUPONS') >= 0) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.HasValidCounpons));
                    }
                    else {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                    }
                }
                res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
            }, res);
        };
        this.ActiveOffer = (req, res) => {
            req.checkBody("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOfferId, errors));
            }
            const id = req.body.id;
            this.dataAccess.UpdateOfferStatus(id, offers_model_1.EOfferStatus.Active, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                else {
                    if (ret.affectedRows == 0) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OfferNotFound));
                    }
                    res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                }
            });
        };
        this.InativateOffer = (req, res) => {
            req.checkBody("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOfferId, errors));
            }
            const id = req.body.id;
            this.dataAccess.UpdateOfferStatus(id, offers_model_1.EOfferStatus.Inative, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                else {
                    if (ret.affectedRows == 0) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OfferNotFound));
                    }
                    res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                }
            });
        };
        this.SearchOffersByCity = (req, res) => {
            req.checkParams("cityId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOwnerId, errors));
            }
            const cityId = req.params["cityId"];
            this.dataAccess.SearchOffersByCity(cityId, res, this.processDefaultResult);
        };
        this.createCoupon = (req, res) => {
            req.checkBody("offerId").isNumeric();
            req.checkBody("userId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOffersRequiredParams, errors));
            }
            const userId = req.body.userId;
            const offerId = req.body.offerId;
            this.dataAccess.GetUserCouponOffer(userId, offerId, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (ret) {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.CouponAlredyExists));
                }
                this.dataAccess.GetOffer(offerId, res, (r, er, result) => {
                    if (er) {
                        return res.json(serviceResult_model_1.ServiceResult.HandlerError(er));
                    }
                    if (!result) {
                        return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OfferNotFound));
                    }
                    this.SubscribeUserCoupon(userId, result, res);
                });
            });
        };
        this.ListUserCoupons = (req, res) => {
            req.checkParams("id").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOwnerId, errors));
            }
            const userId = req.params["id"];
            this.dataAccess.ListUserCoupons(userId, res, this.processDefaultResult);
        };
        this.GetCoupon = (req, res) => {
            req.checkParams("qrHash").notEmpty();
            req.checkParams("userId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidDiscountParams, errors));
            }
            const qrHash = req.params["qrHash"];
            const userId = req.params["userId"];
            this.dataAccess.GetUserCouponOfferHash(qrHash, userId, res, this.processDefaultResult);
        };
        this.UseCoupon = (req, res) => {
            req.checkBody("offerId").isNumeric();
            req.checkBody("userId").isNumeric();
            const errors = req.validationErrors();
            if (errors) {
                return res.json(offersErrors_1.OffersErrorsProvider.GetErrorDetails(offersErrors_1.EOffersErrors.InvalidOffersRequiredParams, errors));
            }
            const userId = req.body.userId;
            const offerId = req.body.offerId;
            this.dataAccess.GetUserCouponOffer(userId, offerId, (err, ret) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (!ret || ret.length === 0) {
                    return res.json(offersErrors_1.OffersErrorsProvider.GetError(offersErrors_1.EOffersErrors.OfferNotFound));
                }
                ret[0].isValid = true;
                this.dataAccess.UseCoupon(ret[0], res, this.processDefaultResult);
            });
        };
        this.SubscribeUserCoupon = (userId, offer, res) => {
            const userDA = new usersDAO_1.UsersDAO();
            userDA.GetUserByOndeIr(userId, res, (r, err, result) => {
                if (err) {
                    return res.json(serviceResult_model_1.ServiceResult.HandlerError(err));
                }
                if (result) {
                    const coupon = coupon_model_1.CouponEntity.GetInstance();
                    coupon.userId = result.Id;
                    coupon.offerId = offer.id;
                    coupon.isValid = false;
                    coupon.couponLink = `http://ondeircidades.com.br/fidelidade/#/coupon/${offer.qrHash}/${result.Id}`;
                    this.dataAccess.CreateCoupon(coupon, (e, resp) => {
                        if (e) {
                            return res.json(serviceResult_model_1.ServiceResult.HandlerError(e));
                        }
                        return res.json(serviceResult_model_1.ServiceResult.HandlerSucess());
                    });
                }
                else {
                    return this.RegisterNewUser(offer, userId, res);
                }
            });
        };
        this.RegisterNewUser = (offer, userId, res) => {
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
                    this.SubscribeUserCoupon(userId, offer, res);
                });
            });
        };
    }
}
exports.OffersController = OffersController;
//# sourceMappingURL=offers.controller.js.map