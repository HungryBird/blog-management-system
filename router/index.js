const fs = require('fs');
const path = require('path');
const url = require('url');
const query = require('../db/query');
const mime = require('../utils').getMime;

function router(request, response) {
    const pathname = url.parse(request.url).pathname;
    console.log('pathname: ', pathname)
    const isAPI = pathname.match(/\/api\/+/);
    let target = pathname;
    let MIME;
    // 请求静态文件
    if(!isAPI) {
        if (pathname === '/') {
            target = 'blog/index.html';
        }
        let pathURL = path.join(process.cwd(), 'web', target);
        MIME = mime(pathURL)
        fs.readFile(pathURL, 'utf-8', function(err, data) {
            if(err && MIME === 'text/html') {
                target = 'blog/404.html';
                pathURL = path.join(process.cwd(), 'web', target);
                const res = fs.readFileSync(pathURL, 'utf-8');
                response.end(res);
                return;
            }
            else if (err) {
                response.writeHead(404, {'Content-type': MIME});
                response.end();
                return;
            }
            response.writeHead(200, {'Content-type': MIME});
            response.end(data);
        })
    }
    // 请求接口
    else {
        MIME = mime(target)
        query.api(target, request, (result) => {
            response.writeHead(200, {'Content-type': 'text/html; charset=UTF-8'});
            response.end(result);
            console.log('result: ', result);
        });
    }
    
}



exports.router = router;