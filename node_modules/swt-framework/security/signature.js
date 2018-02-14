/*
 * Signature for token creation.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var crypto  = require('crypto');
var random  = require('csprng');

module.exports = {
    token: generateToken,
    salt: generateSalt,
    password: generatePassword
};

/**
 * Expose 'generateToken(message: string): string'.
 */
function generateToken(message) {
    var salt = generateTimeStamp() + generateNonce();

    return crypto.createHash('sha256').update(message + salt).digest('hex');
}

function generateTimeStamp() {
    return (new Date().getTime()).toString();
}

function generateNonce() {
    return (Math.random() * (9999999 - 123400) + 123400).toString();
}

function generateSalt() {
    return random(128, 16).toUpperCase();
}

function generatePassword(salt, password) {
    // Previne que o Salt seja nulo
    salt = salt || '';

    var key = crypto.pbkdf2Sync(password, salt, 1024, 128, 'sha256');
    
    return key.toString('hex');
}