# SWT Framework

  [![NPM Version][npm-image]][downloads-url]
  [![NPM Downloads][downloads-image]][downloads-url]
  [![Build][travis-image]][travis-url]
  [![Coverage Status][coveralls-image]][coveralls-url]
  [![Dependencies Status][david-image]][david-url]
  [![Code Climate][climate-image]][climate-url]
  [![NSP Status][nsp-image]][nsp-url]

O framework base para qualquer aplicação SWT

## Instalação
```bash
$ npm install swt-framework
```
	
## Features
 - log -> método para debug e erros, inclui também middleware para uso com [`Express`](https://github.com/expressjs/express)
 - segurança -> controle de acesso, roles, enable preflight
 - email -> método para envio de email, implementação do framework [`emailjs`](https://github.com/eleith/emailjs)
 - models -> modelos para uso geral de aplicações SWT
 - common -> camada de uso geral de aplicações SWT

## Estrutura
```javascript
logger: {
    debug: (salvar log de debug),
    error: (salvar log de erro),
    middleware: (middleware para ser usado com Express)
},
security: {
    signature: (todos os métodos relacionados à criptografia),
    authorize: (autorização por Roles),
    enablePreflight: (habilita CORS),
    checkAuthorization: (autorização por HTTP Authorization Header)
},
constants: {
    add: (manipulação de novas constantes)
},
email: (envio de emails),
models: (classes),
common: (métodos de uso geral)
```

## Exemplo
```javascript
var PORT = process.env.PORT || 8080;

var express   = require('express');
var framework = require('swt-framework');

var app = express();

// Habilita CORS
app.use(framework.security.enablePreflight);
// Verificacoes no Header Authorization
app.use(framework.security.checkAuthorization);

// Rotas
// app.use('/api/v0/me', myController);

// Middleware de erro
app.use(framework.logger.middleware);

// Inicia o servidor
app.listen(PORT);
```

## Testes

  Para realizar os testes, primeiramente, instale todas as dependências, então use `npm test`:

```bash
$ npm install
$ npm test
```

[npm-image]: https://img.shields.io/npm/v/swt-framework.svg
[npm-url]: https://npmjs.org/package/swt-framework.svg
[downloads-image]: https://img.shields.io/npm/dm/swt-framework.svg.svg
[downloads-url]: https://npmjs.org/package/swt-framework
[travis-image]: https://img.shields.io/travis/nmdantas/swt-framework/master.svg
[travis-url]: https://travis-ci.org/nmdantas/swt-framework
[coveralls-image]: https://img.shields.io/coveralls/nmdantas/swt-framework/master.svg
[coveralls-url]: https://coveralls.io/github/nmdantas/swt-framework?branch=master
[david-image]: https://david-dm.org/nmdantas/swt-framework.svg
[david-url]: https://david-dm.org/nmdantas/swt-framework
[climate-image]: https://codeclimate.com/github/nmdantas/swt-framework/badges/gpa.svg
[climate-url]: https://codeclimate.com/github/nmdantas/swt-framework
[nsp-image]: https://nodesecurity.io/orgs/fabbrika/projects/7dd5b9a7-ad31-4c5b-bb12-29e3149a615a/badge
[nsp-url]: https://nodesecurity.io/orgs/fabbrika/projects/7dd5b9a7-ad31-4c5b-bb12-29e3149a615a
