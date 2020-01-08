const http = require('http');
const router = require('./router');

console.log('router: ', router)

const server = http.createServer();

server.listen('8877');

server.on('request', function(request, response) {
    response.writeHead(200, {'Content-type': 'text/html'});
    response.write(router.router(request));
    response.end();
})



console.log('server runing at port: 8877');