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
        console.log('pathURL: ', pathURL)
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
            if(pathname === '/blog/logo.png' || pathname === '/blog/logo.jpg') {
                console.log('进入这里')
                response.writeHead(200, {'Content-type': MIME});
                // var imageFilePath = pathname.substr(1);
                var stream = fs.createReadStream(pathURL);
                var responseData = [];//存储文件流
                if (stream) {//判断状态
                    stream.on( 'data', function( chunk ) {
                        responseData.push( chunk );
                    });
                    stream.on( 'end', function() {
                        var finalData = Buffer.concat( responseData );
                        response.write( finalData );
                        response.end();
                    });
                }
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