/*
 * Models for SWT applications
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-26 | Nicholas M. Dantas
 */

'use strict';

module.exports = {
    SwtError: SwtError
};

function SwtError(options) {
    // Construtor pai
    Error.call(this);

    this.name = 'SwtError';    

    if (typeof options === 'object') {
        this.message = options.message;
        this.code = options.code;
        this.httpCode = options.httpCode || 500;
        this.details = options.details || {};
    } else {
        this.message = options;
    }
}

SwtError.prototype = Object.create(Error.prototype); // Define que SwtError extende Error
SwtError.prototype.constructor = SwtError;