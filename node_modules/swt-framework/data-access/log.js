/*
 * Log data access
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

var common = require('./../common');

var connectionPool = null;

exports = module.exports = initialize;

/**
 * Expose 'initialize()'.
 */
function initialize(pool) {
    connectionPool = pool;

    return {
        add: add
    };
}

function add(logInfo) {
    // Obtem uma conexao do pool
    connectionPool.getConnection(function(poolError, connection) {
        if (poolError) {
            return;
        }
        
        var command = ' INSERT INTO swtmonitordb_dev.LOG SET ? ';
        var args = {
            LEVEL : logInfo.level,
            MESSAGE : logInfo.message,
            SOURCE : logInfo.source,
            STACKTRACE : logInfo.stackTrace,
            INNEREXCEPTION : logInfo.innerException,
            REGISTERDATE : common.dateTime.now().format(),
            LOGARGS : logInfo.args,
            APP_ID : logInfo.applicationId
        };

        connection.query(command, args, function (error, results, fields) {
            connection.release();

            if (error) {
                console.log('Erro Insert Log');
                console.log(error);
            } else {
                console.log('Insert Log Success');
            }
        });
    });
}
