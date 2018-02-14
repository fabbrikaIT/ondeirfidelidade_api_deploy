/*
 * Application data access
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-20 | Nicholas M. Dantas
 */

'use strict';

var connectionPool = null;

exports = module.exports = initialize;

/**
 * Expose 'initialize()'.
 */
function initialize(pool) {
    connectionPool = pool;

    return {
        exists: checkApplication
    };
}

function checkApplication(appToken, successCallback, errorCallback) {
    // Obtem uma conexao do pool
    connectionPool.getConnection(function(poolError, connection) {
        if (poolError) {
            errorCallback(poolError);

            return;
        }

        var query = 'SELECT	APP_ID ' +
                    'FROM swtdb_dev.APPLICATIONS ' +
                    'WHERE LOWER(APPLICATION_TOKEN) = ? ';

        connection.query(query, [appToken], function (error, results, fields) {
            connection.release();

            if (error) {
                errorCallback(error);
            } else {

                // Se nao houver retorno significa que o usuario não tem
                // permissão para acessar a aplicação
                if (results.length > 0) {
                    successCallback();
                } else {
                    errorCallback();
                }
            }
        });
    });
}