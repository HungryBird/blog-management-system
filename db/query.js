const mysql = require('mysql');
const config = require('./config');
const getParams = require('../utils').getParams;
const isEmpty = require('../utils').isEmpty;
const moment = require('moment');

async function api(target, request, cb) {
    const params = await getParams(request);
    if(target === '/api/login') {
        login(params).then(res => {
            cb(JSON.stringify(res));
        })
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
        const queryUser = 'select id,nickname,role,status,birthday from users where username = ? and password = ?';
        const queryParams = [username, password];
        connection.query(queryUser, queryParams, (error, result, fields) => {
            if(result.length === 0) {
                resolve({
                    status: 0,
                    msg: '账号或者密码错误'
                })
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
                }
                resolve({
                    status: 1,
                    data: result[0],
                    msg: '登录成功'
                })
                connection.end();
            })
        })
    })
}

exports.api = api;