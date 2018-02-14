/*
 * Module to log information, warnigs and errors.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var models      = require('./../models');
var logService  = require('./../data-access').log;

module.exports = {
    saveDebug: saveDebug,
    saveError: saveError,
    middleware: middleware
};

function saveDebug(message, source) {
    logService.add({
        level: global.Application.LOG_LEVEL.Debug,
        message: message,
        source: source,
        applicationId: process.env.APPLICATION_ID
    });
}

function saveError(exception, source) {
    logService.add({
        level: global.Application.LOG_LEVEL.Exception,
        message: exception.message,
        source: source || '',
        stackTrace: exception.stack,
        applicationId: process.env.APPLICATION_ID
    });
}

function middleware(err, req, res, next) {
    if (err instanceof models.SwtError) {
        res.status(err.httpCode).json({
            errorCode: err.code,
            errorMessage: err.message || global.Application.ERROR_CODES[err.code],
            errorDetails: err.details
        });
    } else if (err.code) {
        res.status(500).json({
            errorCode: err.code,
            errorMessage: global.Application.ERROR_CODES[err.code] || ''
        });
    } else {
        res.status(err.status || 500).json({
            errorMessage: err.message
        });
    }
}