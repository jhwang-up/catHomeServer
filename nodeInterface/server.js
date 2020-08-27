const express = require('express');
const multer = require('multer');
const mysql = require("mysql");

// const bodyParser=require('body-parser');
const server = express();
// server.use(bodyParser.urlencoded())
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './www/uploadImage') // 指定文件目录
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // 指定文件名
    }
})

server.use(express.static("www"))

var objMulter = multer({ storage: storage })
server.use(objMulter.any());

var connection = mysql.createConnection({ //创建mysql实例
    // host: "localhost", // mysql的 host
    host: "114.215.86.83", // mysql的 host
    // host: "172.31.113.229", // mysql的 host

    port: '3306',
    user: "root", // 我的mysql用户名
    password: "7758521.", // mysql 密码
    database: 'mysqlDemo' // 添加该列
});
connection.connect(err => {
    if (err){
        throw err
    };
    console.log("mysql connected success!接口可以用了！！！！gogogogo！！！！");
})



// // 新建一个表
// server.get('/createTable', function (req, res, next) {
//     console.log(req.body, req.files)

//     const sql = `CREATE TABLE user_avatar(
//     id INT(11) AUTO_INCREMENT PRIMARY KEY,
//     userId VARCHAR(255),
//     name VARCHAR(255),
//     url VARCHAR(255)
//   )`;
//     connection.query(sql, (err, results, filelds) => {
//         console.log(err)
//         if (!err) {
//             res.body = {
//                 code: 200,
//                 msg: `create table of fe_frame success!`
//             }
//         } else {
//             console.log("报错了：：：：：" + err);
//             res.body = {
//                 code: 200,
//                 msg: `报错了：：：：${err}`
//             }
//         }
//     })

// })

// 新增数据库
server.get('/createDb', function (req, res, next) {
    const sql = `CREATE DATABASE mysqlDemo`;
    connection.query(sql, (err) => {
        if (err){
            throw err
        };
        console.log(1111111)
        res.body = {
            code: 20000,
            msg: `create database mysqlDemo success!`
        }
    });

})
// 新增表
server.get('/createTable', function (req, res, next) {
    const sql = `CREATE TABLE catStore(
        userId INT(11) AUTO_INCREMENT PRIMARY KEY,
        imgList VARCHAR(255),
        address VARCHAR(255),
        tel VARCHAR(255),
        businessTime VARCHAR(255),
        parking VARCHAR(255),
        wifi VARCHAR(255),
        info VARCHAR(255),
        name VARCHAR(255),
        latitude VARCHAR(255),
        longitude VARCHAR(255)
      )`;
        connection.query(sql, (err, results, filelds) => {
            if (err){
                throw err
            }
            if (!err) {
                res.body = {
                    code: 20000,
                    msg: `create table of user_avatar success!`
                }
            }
        })

})

// 登录
server.post('/user/login', function (req, res, next) {
    res.send({
        code: 20000,
        msg: '成功',
        data: {"token":"admin-token"}
    })
})

// 获取登录用户信息
server.get('/user/info', function (req, res, next) {
    res.send({
        "code":20000,
        "data":{"roles":["admin"],"introduction":"I am a super administrator","avatar":"https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif","name":"Super Admin"}
    })
})


// 新增商家
server.post('/api/v1/catstore/add', function (req, res, next) {
    //不能正确解析json 格式的post参数
    var body = '', jsonStr;
    req.on('data', function (chunk) {
        body += chunk; //读取参数流转化为字符串
    });
    req.on('end', function () {
        //读取参数流结束后将转化的body字符串解析成 JSON 格式
        try {
            jsonStr = JSON.parse(body);
            req.body=jsonStr;
            // 根据用户id查找，如果之前有值就修改之前的，否则就插入一条新的
            let userId=req.body.userId||""; // 没有传id就代表是新增的
            let sql = `SELECT * FROM catStore WHERE userId = '${userId}'`;
            connection.query(sql, (err, result) => {
                if (err){
                    throw err;
                }
                if (result.length > 0) {
                    // 修改数据
                    let sql = `UPDATE catStore SET imgList = '${req.body.imgList}',address='${req.body.address}',
                    tel='${req.body.tel}',businessTime='${req.body.businessTime}',parking='${req.body.parking}',
                    wifi='${req.body.wifi}',info='${req.body.info}',name='${req.body.name}',latitude='${req.body.latitude}',longitude='${req.body.longitude}'
                    WHERE userId = '${req.body.userId}'`;
                    connection.query(sql, (err, result) => {
                        if (err) throw err;
                        console.log("修改成功")
                        res.send({
                            code: 1,
                            msg: '修改成功',
                            data: {}
                        })
                    })
                } else {
                    let sql = `INSERT INTO catStore(imgList,address, tel,businessTime,parking,wifi,info,name,latitude,longitude)
                                VALUES('${req.body.imgList}', '${req.body.address}','${req.body.tel}','${req.body.businessTime}'
                                ,'${req.body.parking}','${req.body.wifi}','${req.body.info}','${req.body.name}','${req.body.latitude}','${req.body.longitude}')`;
                    connection.query(sql, function (err, result) {
                        if (err) {
                            console.log('[SELECT ERROR]:', err.message);
                        }
                        console.log("新增成功")
                        res.send({
                            code: 20000,
                            msg: '新增成功',
                            data: {}
                        })
                    });

                }
            })
        } catch (err) {
            jsonStr = null;
            throw err;
        }
    });

    // // 插入图片
    // var strurl = req.files[0].path.replace(/\\/g, "/");

    
})
server.listen(3001);