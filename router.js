const fs = require('fs');
const path = require('path');
const url = require('url');

function router(request) {
    const pathname = url.parse(request.url).pathname;
    console.log('pathname: ', pathname)
    let target = '';
    if (pathname === '/') {
        target = 'web/index.html';
    }
    else if(pathname === '/favicon.ico') {
        target = 'favicon.ico';
    }
    else {
        target = 'web/' + pathname;
    }

    console.log('__dirname: ', path.join(__dirname, target))
    const pathURL = path.resolve(__dirname, target);
    console.log('pathURL: ', pathURL)
    const res = fs.readFileSync(pathURL)
    return res;
}

exports.router = router;