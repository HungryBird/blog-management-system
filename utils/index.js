const url = require('url');
const querystring = require('querystring');
const mime = require('mime');

const getParams = (request) => {
    return new Promise(resolve => {
        if (request.method === 'GET') {
            resolve(url.parse(request.url, true).query)
        }
        else if(request.method === 'POST'){
            let chunk = ''
            request.on('data', (data) => {
                chunk += data;
            });
            request.on('end', () => {
                resolve(querystring.parse(chunk))
            })
        }
    })
}

// MIME添加utf8
const getMime = (url) => {
    return mime.getType(url);
}

// 转换小写
const getLowerCase = (str) => {
    if (isEmpty(str)) return str;
    if (getType(str) !== 'string') return false;
    return str.toLowerCase(); 
}

// 转换大写
const getUpperCase = (str) => {
    if (isEmpty(str)) return str;
    if (getType !== 'string') return false;
    return str.toUpperCase(); 
}

// 获取类型
const getType = (data) => {
    const _dict = {
        '[object Object]': 'object',
        '[object String]': 'string',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Symbol]': 'symbol',
        '[object Regex]': 'regExp',
        '[object Set]': 'set',
        '[object Function]': 'function',
        '[object Map]': 'map',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object WeakSet]': 'weakset',
        '[object WeakMap]': 'weakmap',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
    }
    return _dict[Object.prototype.toString.call(data)];
}

// 判断是否为空
const isEmpty = (data) => {
    const type = getType(data)
    if (type === 'object') {
        for(const key in data) {
            if(data.hasOwnPropert(hasOwnProperty)) {
                return false;
            }
        }
        return true;
    }
    if (type === 'array') {
        return data.length === 0;
    }
    if (type === 'set' || type === 'weakset' || type === 'map' || type === 'weakmap') {
        return data.size === 0;
    }
    if(type === 'number' || type === 'boolean') return false;
    return !data;
}

module.exports = {
    getParams,
    getLowerCase,
    getType,
    getUpperCase,
    isEmpty,
    getMime,
}