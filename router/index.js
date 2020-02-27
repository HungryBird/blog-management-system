const fs = require('fs');
const path = require('path');
const url = require('url');
const query = require('../db/query');
const mime = require('../utils').getMime;
const isImg = require('../utils').isImg;
const isCORS = require('../utils').isCORS;

function router(request, response) {
    const pathname = url.parse(request.url).pathname;
    console.log('pathname: ', pathname)
    const isAPI = pathname.match(/\/api\/+/);
    let target = pathname;
    let MIME;
    // 请求静态文件
    if(!isAPI) {
        if (pathname === '/') {
            target = 'test/index.html';
        }
        let pathURL = path.join(process.cwd(), 'web', target);
        MIME = mime(pathURL)
        fs.readFile(pathURL, 'utf-8', function(err, data) {
            if(err && MIME === 'text/html') {
                target = 'test/404.html';
                pathURL = path.join(process.cwd(), 'web', target);
                const res = fs.readFileSync(pathURL, 'utf-8');
                response.end(res);
            }
            else if (err) {
                response.writeHead(404, {'Content-type': MIME});
                response.end();
            }
            else if(isImg(pathURL)) {
                response.writeHead(200, {'Content-type': MIME});
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
            }
            else {
                response.writeHead(200, {'Content-type': MIME});
                response.end(data);
            }
            
        })
    }
    // 请求接口
    else {
        MIME = mime(target)
        if(isCORS(request)) {
            response.writeHead(200, {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Headers': 'Content-type,Content-Length,Authorization,Accept,X-Requested-Width,x-requested-with',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
            })
            response.end();
        }
        else {
            query.api(target, request, (result) => {
                response.writeHead(200, {
                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                    'Content-type': 'text/html; charset=UTF-8'
                })
                response.end(result);
            });
        }
    }
    
}


exports.router = router;