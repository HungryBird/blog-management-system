const fs = require('fs');
const path = require('path');
const url = require('url');
const mime = require('mime');

function router(request, response) {
    const pathname = url.parse(request.url).pathname;
    let target = '';
    if (pathname === '/') {
        target = 'blog/index.html';
    }
    else {
        target = pathname;
    }
    const pathURL = path.join(process.cwd(), 'web', target);
    console.log('pathURL: ', pathURL)
    const MIME = mime.getType(pathURL);
    fs.readFile(pathURL, 'utf-8', function(err, data) {
        if(err && MIME === 'text/html') {
            target = 'blog/404.html';
            response.end(res);
        }
        else if (err) {
            response.writeHead(404, {'Content-type': MIME});
            response.end();
        }
        response.writeHead(200, {'Content-type': MIME});
        response.end(data);
    })
}

exports.router = router;