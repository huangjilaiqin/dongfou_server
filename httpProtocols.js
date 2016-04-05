
var express= require('express');
var fs = require('fs');
var path = require('path');
var app = express();
var formidable = require('formidable');
var global = require('./global.js');
var db = require('./DBPool.js');
var util = require('./util.js');
var log = require('./log.js').logHttpProtocol;

var videoPath = serverConfig.videoPath;
var imgPath = serverConfig.imgPath
var async = require("async");


//---------------dongfou----------------------
app.post('/dongfou/sports', function (req, res) {
    console.log('post sports');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var sql = "select * from t_sport";
        db.query(sql, [], function(err, rows){
            if(err){
                responseError(res, err);
            }else{
                responseNormal(res, {'datas':rows});
            }
        });
    });
});

app.get('/dongfou/sports', function (req, res) {
    console.log('get sports');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var sql = "select * from t_sport";
        db.query(sql, [], function(err, rows){
            if(err){
                responseError(res, err);
            }else{
                responseNormal(res, {'datas':rows});
            }
        });
    });
});

app.post('/dongfou/login', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var mail = fields['mail'];
        var passwd = fields['passwd'];
        if(mail==undefined || mail=="" || passwd==undefined || passwd==""){
            responseError(res, "argument is error");  
        }else{
            var sql = 'select * from t_dongfou_user where mail=? and passwd=?';
            db.query(sql, [mail,passwd], function(err, rows){
                if(err!=null){
                    responseError(res, err);
                }else if(rows.length>0){
                    responseNormal(res, rows[0]);    
                }else{
                    responseError(res, "user is not exit"); 
                }
            });
        }
    });
});

//register
app.post('/dongfou/register', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var mail = fields['mail'];
        var passwd = fields['passwd'];
        if(mail==undefined || mail=="" || passwd==undefined || passwd==""){
            res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
            var resData = {'error':"error arguments"};
            responseError(res, resData); 
            return;
        }
        checkMail = 'select 1 from t_user where mail=?'
        db.query(checkMail, [mail], function(err, rows){
            if(err!=null){
                res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
                var resData = {'error':err};
                responseError(res, resData); 
                return;
            }
            if(rows.length>0){
                res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
                var resData = {'error':'mail is already register'};
                responseError(res, resData); 
                return;
            }else{
                sql = "insert into t_dongfou_user(mail,passwd)values(?,?)";
                values = [mail, passwd];
                db.query(sql, values, function(err, rows){
                    if(err!=null){
                        res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
                        var resData = {'error':err};
                        responseError(res, resData); 
                        return;
                    }
                    var userid = rows.insertId;
                    res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
                    var resData = {'userid':userid};
                    res.write(JSON.stringify(resData));
                    res.end();
                    log.trace('register success:',mail, passwd);
                });
            }
        });
    });
});

app.post('/dongfou/upload/sportrecord', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var recordsStr = fields['records'];
        console.log(recordsStr);
        if(recordsStr==undefined || recordsStr==""){
            responseError(res, "argument is error");  
        }else{
            var records = JSON.parse(fields['records']);
            var sql = 'insert into t_sport_record(userid,sportid,amount,arg1,arg2,time) values (?,?,?,?,?,?)';
            async.map(records, function(record, callback) {
                console.log(typeof(record['time']));
                db.query(sql, [record['userid'],record['sportid'],record['amount'],record['arg1'],record['arg2'],record['time']], function(err, rows){
                    if(err!=null){
                        callback(err,null);
                    }else{
                        var data = {
                            id:record['id'],
                            seq:rows.insertId,
                            userid:record['userid'],
                        };
                        console.log(data);
                        callback(null, data);
                    }
                });
            }, function(err, results){
                console.log(err,results);
                if(err){
                    responseError(res, err);
                    return;
                }
                responseNormal(res,{'datas':results});
            });
        }
    });
});

app.post('/dongfou/feedback', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var userid = fields['userid'];
        var content = fields['content'];
        console.log(content);
        if(userid==undefined || content==undefined || content==""){
            responseError(res, "argument is error");  
        }else{
            var sql = 'insert into t_feedback(userid,content) values (?,?)';
            db.query(sql, [userid,content], function(err, rows){
                if(err!=null){
                    responseError(res, err);
                }else{
                    responseNormal(res,{});
                }
            });
        }
    });
});




//-------------------公共方法-------------------

function mylog(msg){
    console.log(msg);
    log.info(msg);
}
function responseError(res, error){
    console.log(error);
    res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
    res.write(JSON.stringify({'error':JSON.stringify(error)}));
    res.end();
}

function responseNormal(res, data){
    res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
    res.write(JSON.stringify(data));
    res.end();
}

function arrayRemoveElement(elements, e){
    var i = elements.indexOf(e);
    if(i != -1) {
        elements.splice(i, 1);
    }
}

function isAnyUndefined(datas){
    var size = datas.length;
    for(var i=0;i<size;i++){
        if(datas[i]==undefined)
            return true;
    }
    return false;
}

//-------------------公共方法-------------------
//
//post方法框架


console.log('begin express');
app.listen(5005);
console.log('http protocol listen on 5005');
