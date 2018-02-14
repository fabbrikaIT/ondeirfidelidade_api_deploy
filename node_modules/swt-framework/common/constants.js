/*
 * Constants for general use. All constants must be in "Application" namespace.
 * 
 * Copyright(c) 2017 Fabbrika
 * Author: 2017-03-19 | Nicholas M. Dantas
 */

'use strict';

var models = require('./../models');

module.exports = {
    add: addNew
}

const LOG_LEVEL = {
    Debug: 0,
    Information: 1,
    Warning: 2,
    Exception: 3, 
    Fatal: 4
};

const ERROR_CODES = {
    /* USER */
    "US001": "Usuário ou Senha inválidos!",
    "US002": "Usuário não ativo, verifique!",
    "US003": "Documento nulo ou inválido.",
    "US004": "Dados obrigatórios do usuário não preenchidos ou inválidos",
    "US005": "Usuário já cadastrado na plataforma.",
    "US006": "Usuário não encontrado.",
    "US007": "Usuário com pendencias em eventos, verifique!",
    "US008": "Operação não autorizada para o usuário.",
    "US009": "Usuário não cadastro, tente novamente.",
    "US010": "Usuário não logado na plataforma.",
    "US011": "Usuário não autorizado! Idade mínima para Chef é de 18 anos.",
    "US012": "Senha informada inválida.",
    "US013": "CEP informado não encontrado.",
    "US014": "Não foi possível atualizar a senha.",
    "US015": "Usuário com status Resetado, favor alterar a senha.",
    "US016": "Não foi possível atualizar as informações do Usuário.",
    "US017": "Documento já cadastrado para outro usuário.",
    "US018": "Não existe a aplicação para a criação do usuário.",
    "US019": "Não foi possível ativar o usuário para a aplicação",
    "US020": "Não existem grupos de aplicação.",
    "US021": "Não foi encontrada a imagem requisitada.",
    /* APP */
    "APP001": "Dados obrigatórios da aplicação não preenchidos ou inválidos.",
    "APP002": "Aplicação já existente na base de dados.",
    "APP003": "Ocorreu um erro durante a persistencia no banco de dados.",
    "APP004": "Aplicação não existente.",
    "APP005": "Argumentos de chamandas inválidos.",
    /* MEDIA */
    "MED001": "Não foi possível conectar ao servidor.",
    "MED002": "Não foi possível gravar a imagem no servidor."
};

/**
 * Expose 'addNew(key: string, data: object): void'.
 */
function addNew(key, data) {
    // Apenas inclui os novos dados as constantes caso nao existe a chave "key" no namespace
    if (global.Application[key] === undefined) {

        global.Application[key] = data;
    } else {

        throw new models.SwtError({message: 'Key already present in Constants'});
    }
}

global.Application = global.Application || {};
global.Application.LOG_LEVEL = LOG_LEVEL;
global.Application.ERROR_CODES = ERROR_CODES;
