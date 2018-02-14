/*
 * Default SMTP client to send emails of any kind
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-26 | Nicholas M. Dantas
 */

'use strict';

/*
 * Module dependencies.
 */
var email   = require('emailjs');
var models  = require('./../models');
var logger  = require('./../security/logger');

module.exports = {
    send: sendEmail,
    defaults: {
        callback: defaultCallback
    }
}

/**
 * Send email.
 * 
 * send(message: emailjs-message, errorCallback: function): void 
 * 
 * emailjs-message:
 * {
 *    text		    // text of the email 
 *    from		    // sender of the format (address or name <address> or "name" <address>)
 *    to			// recipients (same format as above), multiple recipients are separated by a comma
 *    cc			// carbon copied recipients (same format as above)
 *    bcc		    // blind carbon copied recipients (same format as above)
 *    subject	    // string subject of the email
 *    attachment    // one attachment or array of attachments
 * }
 * 
 * attachment:
 * {
 *    // one of these fields is required
 *    path        // string to where the file is located
 *    data        // string of the data you want to attach
 *    stream      // binary stream that will provide attachment data (make sure it is in the paused state)
 *                // better performance for binary streams is achieved if buffer.length % (76*6) == 0
 *                // current max size of buffer must be no larger than Message.BUFFERSIZE
 * 
 *    // optionally these fields are also accepted
 *    type	      // string of the file mime type
 *    name        // name to give the file as perceived by the recipient
 *    charset     // charset to encode attatchment in
 *    method      // method to send attachment as (used by calendar invites)
 *    alternative // if true, will be attached inline as an alternative (also defaults type='text/html')
 *    inline      // if true, will be attached inline
 *    encoded     // set this to true if the data is already base64 encoded, (avoid this if possible)
 *    headers     // object containing header=>value pairs for inclusion in this attachment's header
 *    related     // an array of attachments that you want to be related to the parent attachment
 * }
 */
function sendEmail(message, callback, config) {
    config = config || {};

    var smtpClient = email.server.connect({
        user     : config.user || process.env.MAIL_USER, 
        password : config.password || process.env.MAIL_PASS, 
        host     : config.host || process.env.MAIL_HOST, 
        port     : (config.ssl || process.env.MAIL_SSL) ? null : (config.port || process.env.MAIL_PORT),
        ssl      : config.ssl || process.env.MAIL_SSL
    });

    smtpClient.send(message, callback || defaultCallback);
}

function defaultCallback(error, message) {
    // Verifica se houve erro
    if (error) {
        error = new models.SwtError({message: error.message});

        logger.saveError(error, 'swtFramework.common.email.send');
    }
}