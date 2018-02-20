"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./config/server");
const http = require("http");
const port = process.env.APP_PORT || 8080;
server_1.default.set('port', port);
const server = http.createServer(server_1.default);
server.listen(port);
server.on('listening', onListening);
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind + ' path:' + __dirname);
}
//# sourceMappingURL=index.js.map