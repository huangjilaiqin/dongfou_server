
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
var md5 = require("md5");


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

function generateToken(key){
    return md5(key+new Date().getTime());
}

app.post('/dongfou/login', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var mail = fields['mail'];
        var passwd = fields['passwd'];
        if(mail==undefined || mail=="" || passwd==undefined || passwd==""){
            responseError(res, "邮箱或密码不能为空");  
        }else{
            var sql = 'select * from t_dongfou_user where mail=? and passwd=?';
            db.query(sql, [mail,passwd], function(err, rows){
                if(err!=null){
                    responseError(res, err);
                }else if(rows.length>0){
                    var data = rows[0];
                    var userid = data['id'];
                    var token = generateToken(mail);
                    var now = new Date();
                    var sql = 'update t_token set token=?,time=? where userid=?'
                    db.query(sql, [token,now,userid],function(err,result){
                        if(err){
                            responseError(res,err);
                        }else{
                            if(result.affectedRows>0){
                                responseNormal(res,{userid:userid,token:token,time:now});
                            }else{
                                sql = 'insert into t_token values(?,?,?)';
                                db.query(sql, [userid,token,now],function(err,result){
                                    if(err){
                                        responseError(res,err);
                                    }else{
                                        responseNormal(res,{userid:userid,token:token,time:now});
                                    }
                                });
                            }
                            console.log(userid,' new token:'+token);
                        }
                    });
                }else{
                    var sql = 'select * from t_dongfou_user where mail=?';
                    db.query(sql, [mail], function(err, rows){
                        if(err){
                            responseError(res, err); 
                        }else if(rows.length>0){
                            responseError(res,'密码错误');
                        }else{
                            responseError(res,'该邮箱未注册');
                        }
                    });
                }
            });
        }
    });
});

app.post('/dongfou/logout', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var userid = fields['userid'];
        var token = fields['token'];
        console.log('logout:'+userid+" token:"+token);
        if(userid==undefined || userid=="" || token==undefined || token==""){
            responseError(res, "参数不对");  
        }else{
            var sql = 'select * from t_token where userid=? and token=?'
            db.query(sql, [userid,token],function(err,rows){
                if(err){
                    responseError(res,err);
                }else{
                    if(rows.length>0)
                        responseNormal(res,{});
                    else
                        responseError(res,'not value token');
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
            var resData = {'error':"error arguments"};
            responseError(res, resData); 
            return;
        }
        checkMail = 'select 1 from t_user where mail=?'
        db.query(checkMail, [mail], function(err, rows){
            if(err!=null){
                var resData = {'error':err};
                responseError(res, resData); 
                return;
            }
            if(rows.length>0){
                var resData = {'error':'mail is already register'};
                responseError(res, resData); 
                return;
            }else{
                sql = "insert into t_dongfou_user(mail,passwd)values(?,?)";
                values = [mail, passwd];
                db.query(sql, values, function(err, rows){
                    if(err!=null){
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
        var recordsstr = fields['records'];
        var userid = fields['userid'];
        var token = fields['token'];
        console.log('upload record:', recordsstr);
        if(recordsstr==undefined || recordsstr=="" || token==undefined || userid==undefined){
            responseError(res, "argument is error");  
        }else{
            var records = JSON.parse(fields['records']);
            checkToken(userid,token, function(err){
                if(err){
                    console.log('checkToken err:', err);
                    responseError(res, err);
                }else{
                    var sql = 'insert into t_sport_record(userid,sportid,amount,arg1,arg2,time) values (?,?,?,?,?,?)';
                    async.map(records, function(record, callback) {
                        db.query(sql, [record['userid'],record['sportid'],record['amount'],record['arg1'],record['arg2'],record['time']], function(err, rows){
                            if(err!=undefined){
                                callback(err,undefined);
                            }else{
                                var data = {
                                    id:record['id'],
                                    seq:rows.insertId,
                                    userid:record['userid'],
                                };
                                console.log('insert record:' ,data);
                                callback(undefined, data);
                            }
                        });
                    }, function(err, results){
                        console.log(err,results);
                        if(err){
                            responseError(res, err);
                        }else{
                            responseNormal(res,{'datas':results});
                        }
                    });
                }
                console.log('async map over');
            });
            
        }
    });
});

app.post('/dongfou/download/sportrecord', function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var recordsstr = fields['records'];
        var userid = fields['userid'];
        var token = fields['token'];
        console.log('download sportrecord userid:',userid,recordsstr);
        if(recordsstr==undefined || recordsstr=="" || token==undefined || userid==undefined){
            responseError(res, "argument is error");  
        }else{
            var records = JSON.parse(fields['records']);
            if(records.length>0){
                var sql = 'select * from t_sport_record where userid=? and sportid=? and seq>?';
                async.map(records, function(record, callback) {
                    db.query(sql, [record['userid'],record['sportid'],record['seq']], function(err, rows){
                        if(err!=null){
                            callback(err,null);
                        }else{
                            callback(null, rows);
                        }
                    });
                }, function(err, results){
                    console.log(err,results);
                    if(err){
                        responseError(res, err);
                        return;
                    }
                    var datas = [];
                    for(var i in results){
                        var sportidDatas = results[i] ;  
                        for(var j in sportidDatas){
                            var record = sportidDatas[j];
                            datas.push(record);
                        }
                    }
                    console.log(datas);
                    responseNormal(res,{'datas':datas});
                });
            }else{
                //查找所有运动记录
                var sql = 'select * from t_sport_record where userid=?';
                db.query(sql, [userid], function(err, rows){
                    if(err!=null){
                        responseError(res, err);
                    }else{
                        responseNormal(res,{'datas':rows});
                    }
                });
            }
        }
    });
});



app.post('/dongfou/sportrecord/delete', function (req, res) {

    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        var token = fields['token'];
        var userid = fields['userid'];
        var id = fields['id'];
        var sportid = fields['sportid'];
        var seq = fields['seq'];
        
        if(userid==undefined){
            responseError(res, "argument is error");  
        }else{
            checkToken(userid,token, function(err){
                if(err){
                    responseError(res, err);
                }else{
                    deleteSportRecord(res,id,userid,seq)
                }
                    
            });
        }
    });
});

function deleteSportRecord(res,id,userid,seq){
    var sql = 'delete from t_sport_record where userid=? and seq=?';
    db.query(sql, [userid,seq], function(err, rows){
        if(err!=null){
            responseError(res, err);
        }else{
            var data = {
                id:id,
                seq:seq,
                userid:userid,
            };
            responseNormal(res,data);
        }
    });
}


var tokens = {};
function checkToken(userid,token,callback){
    var now = new Date().getTime()/1000;
    var data = tokens[userid];
    if(data!=undefined){
        realToken = data['token'];
        time = data['time'];
        //token 7X24 
        if(token==realToken && (now-time)<604800){
            callback(undefined);
        }else{
            callback({error:'token expire',errno:301});
        }
    }else{
        var sql = 'select * from t_token where userid=?';
        console.log('query token');
        db.query(sql, [userid], function(err, rows){
            if(err!=undefined){
                callback(err);
            }else{
                if(rows.length==0){
                    callback({error:'no token',errno:302});
                    console.log('no token');
                }else{
                    realToken = rows[0]['token'];
                    console.log('db token:',realToken,' checkToken:'+token);
                    if(token==realToken)
                        callback(undefined);
                    else
                        callback({error:'token is not right',errno:303});
                }
            }
        });
    }
}


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


app.get('/dongfou/beat', function (req, res) {
    res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
    res.write('ok');
    res.end();
});

app.post('/dongfou/notices', function (req, res) {
    console.log('get notices');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var id = fields['id'];
        var sql = "select * from t_dongfou_notice where id>? order by id";
        db.query(sql, [id], function(err, rows){
            if(err){
                responseError(res, err);
            }else{
                responseNormal(res, {'datas':rows});
            }
        });
    });
});

app.post('/dongfou/checkupdate', function (req, res) {
    console.log('checkupdate');
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var userid = fields['userid'];
        var deviceid = fields['deviceid'];
        var versioncode = fields['versioncode'];
        var sql = "select * from t_dongfou_version order by versioncode desc limit 1";
        db.query(sql, [], function(err, rows){
            if(err){
                responseError(res, err);
            }else{
                rows[0]['url']='https://www.pgyer.com/dongfou';
                responseNormal(res, rows[0]);
            }
        });
        sql = "insert into t_dongfou_sign (userid,deviceid,versioncode,time) values (?,?,?,now())";
        db.query(sql, [userid,deviceid,versioncode], function(err, rows){
            if(err){
                console.log(err);
            }
        });
    });
});



//-------------------公共方法-------------------

function mylog(msg){
    console.log(msg);
    log.info(msg);
}
function responseError(res, error){
    console.log('responseError', error);
    res.writeHead(200, {'content-type': 'text/plain;charset=UTF-8'});
    if(typeof(error)=='string')
        res.write(JSON.stringify({'error':JSON.stringify(error)}));
    else
        res.write(JSON.stringify(error));
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

