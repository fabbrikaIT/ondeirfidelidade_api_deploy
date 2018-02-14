/*
 * Framework for SWT applications
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
global.CacheManager = require('lru-cache')({ /* A instancia de Gerenciador de Cache deve ser unico para todo o servidor */
    max: process.env.CACHE_MAX || Infinity,
    maxAge: process.env.CACHE_MAX_AGE || 1000 * 60 * 10 /* Tempo Default no Cache Atual - 10 minutos */
});
var common      = require('./common');
var email       = require('./common/email');
var linq        = require('./common/linq');
var constants   = require('./common/constants');
var media       = require('./common/media');
var models      = require('./models');
var logger      = require('./security/logger');
var signature   = require('./security/signature');
var access      = require('./security/access-control');
var authorize   = require('./security/roles-authorization');

module.exports = {
    logger: {
        debug: logger.saveDebug,
        error: logger.saveError,
        middleware: logger.middleware
    },
    security: {
        signature: signature,
        authorize: authorize,
        enablePreflight: access.enablePreflight,
        checkAuthorization: access.checkAuthorization        
    },
    constants: {
        add: constants.add
    },
    email: email,
    models: models,
    common: common,
    media: media
};