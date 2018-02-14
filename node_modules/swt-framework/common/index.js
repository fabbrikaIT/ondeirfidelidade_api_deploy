/*
 * Common functions for general use
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-25 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var moment   = require('moment-timezone');
var validate = require('validate.js');

// Mensagem padrão para campo obrigatório
validate.validators.presence.message = "é obrigatório(a)";

module.exports = {
    parseAuthHeader: parseAuthHeader,
    validation: {
        validate: validate,
        requiredFor: requiredFor
    },
    dateTime: {
        now: dateTimeNow
    }
};

/**
 * Parse the Authorization header to json
 * 
 * parseAuthHeader(authorization: string): Object 
 * {
 *     type: ('app' | basic' | 'bearer' | etc...),
 *     token: 'access_token'
 * }.
 */
function parseAuthHeader(authorization) {
    authorization = authorization || '';

    var authRegex = new RegExp(/([A-z]+)\s+/ig);
    var matches = authRegex.exec(authorization);
    var authType = matches ? matches[1].toLowerCase() : '';
    var key = authorization.replace(authRegex, '').toLowerCase();

    return {
        type: authType,
        token: key
    };
}

/**
 * Create required constraints for the fields
 * 
 * requiredFor(fields: string[] | string...): Object 
 * {
 *     fields[1]: {
 *         presence: true
 *     },
 *     fields[2]: {
 *         presence: true
 *     },
 *     fields[n]: {
 *         presence: true
 *     }
 * }.
 */
function requiredFor(fields) {
    fields = Array.isArray(fields) ? fields : Array.prototype.slice.call(arguments);

    var constraints = {};

    for (var i = 0; i < fields.length; i++) {
        constraints[fields[i]] = {
            presence: true
        };
    }

    return constraints;
}

/**
 * Return the current date (moment-timezone object) of Brasil, São Paulo
 */
function dateTimeNow() {
    return moment.tz('America/Sao_Paulo');
}