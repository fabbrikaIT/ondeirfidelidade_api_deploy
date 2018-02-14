/*
 * Authorization based in Roles.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Global dependencies.
 * CacheManager: LRU-Cache
 */
var common = require('./../common');
var accessControl = require('./access-control');

module.exports = authorize;

/**
 * Expose 'authorize(message: string... | string[]): Express Middleware'.
 */
function authorize(roles) {
    var authorizedRoles = Array.isArray(roles) ? roles : Array.prototype.slice.call(arguments);

    // Deve retornar este middleware para tratamento do framework Express
    return function middleware(req, res, next) {
        var authHeader = common.parseAuthHeader(req.headers.authorization);

        // Valida se ha o token da autorizacao
        if (authHeader.type !== 'basic') {
            return accessControl.unauthorize(req, res);
        }

        // Verifica se o usuario esta no cache
        if (global.CacheManager.has(authHeader.token)) {
            var userRoles = global.CacheManager.get(authHeader.token).roles;
            var authorized = false;

            // Percorre todas as Roles do usuario 
            // Se o usuario possuir ao menos uma das Roles do parametro de entrada permite prosseguir
            for (var i = 0; i < userRoles.length; i++) {
                authorized |= authorizedRoles.indexOf(userRoles[i]) > -1;
            }

            // Chama o proximo middleware da cadeia de chamadas e usa o 'return' para prevenir qualquer propagacao
            if (authorized) {
                return next();
            }
        }
        
        // Caso o codigo chegue a este ponto significa que falhou em todas 
        // as tentativas de autorizar o usuario e deve devolver que nao ha autorizacao
        return accessControl.unauthorize(req, res);
    }
}