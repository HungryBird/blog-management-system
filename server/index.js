const http = require('http');
const router = require('../router');

const server = http.createServer();

server.listen('8877');

function serve() {
    server.on('request', function(request, response) {
        router.router(request, response)
    })
    console.log('server runing at port: 8877');
}

module.exports = serve;

