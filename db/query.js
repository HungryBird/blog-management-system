const mysql = require('mysql');
const config = require('./config');
const getParams = require('../utils').getParams;
const isEmpty = require('../utils').isEmpty;
const moment = require('moment');
const jwt = require('jsonwebtoken');
const secret = require('./secret');

async function api(target, request, cb) {
    let params = await getParams(request);
    try{
        params = JSON.parse(params);
    }
    catch(e) {}
    if(target === '/api/login') {
        login(params).then(res => {
            cb(JSON.stringify(res));
        })
    }
    else{
        const token = request.headers.token;
        if(isEmpty(token)) {
            cb({
                status: -1,
                msg: '不存在token'
            })
        }
        else {
            jwt.verify(token, secret, (error, decoded) => {
                if(error) {
                    cb({
                        status: -1,
                        msg: error.message,
                    })
                }
                else {
                    console.log('decoded: ', decoded);
                }
            })
        }
    }
}

function login(params) {
    return new Promise(resolve => {
        const {username, password} = params;
        if(isEmpty(username) || isEmpty(password)) {
            resolve({
                status: 0,
                msg: '账号或者密码不能为空'
            })
        }
        const connection = mysql.createConnection(config.config);
        connection.connect();
        const queryUser = 'select user_id from users where username = ? and password = ?';
        const queryParams = [username, password];
        connection.query(queryUser, queryParams, (error, result, fields) => {
            if(!result || result.length === 0) {
                resolve({
                    status: 0,
                    msg: '账号或者密码错误'
                })
                connection.end();
                return;
            }
            const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            const updateLoginTime = 'update users set login_time = ? where username = ? ';
            const updateLoginTimeParams = [date, username];
            connection.query(updateLoginTime, updateLoginTimeParams, (updateError, updateResult, updateFields) => {
                if(updateError) {
                    resolve({
                        status: 0,
                        msg: '登录失败'
                    })
                    connection.end();
                    return;
                }
                const exp = Date.now() + 24*7*60*1000;
                const obj = {
                    exp,
                    id: result[0].user_id,
                }
                const token = jwt.sign(obj, secret);
                const updateToken = 'update users set token = ? where username = ?';
                connection.query(updateToken, [token, username], (tError, tResult, tFields) => {
                    if(tError) {
                        resolve({
                            status: 0,
                            msg: '登录失败'
                        })
                    }
                    resolve({
                        status: 1,
                        token,
                        msg: '登录成功'
                    })
                    connection.end();
                })
            })
        })
    })
}

exports.api = api;