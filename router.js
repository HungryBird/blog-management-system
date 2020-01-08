const fs = require('fs');
const path = require('path');
const url = require('url');

function router(request) {
    const pathname = url.parse(request.url).pathname;
    console.log('pathname: ', pathname)
    const pathURL = path.resolve(__dirname, pathname);
    console.log('pathURL: ', pathURL)
    const res = fs.readFileSync(pathURL)
    return res;
}

exports.router = router;