

var nodemailer = require('nodemailer');
var db = require('./DBPool.js');
var http=require('http'); 

var smtpConfig = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: '1577594730@qq.com',
        pass: '19910803huangji'
    }
};

var mailOption = {
    from :'"dongfou" <1577594730@qq.com>',
    to:'huangji_gd@163.com',
    subject:'test',
    text:'hello mail',
};

var transporter = nodemailer.createTransport(smtpConfig);

function send(subject,text){
    mailOption.subject = subject;
    mailOption.text = text;
    transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.error(error,info);
        }
    });
}

function sendHtml(subject,html){
    mailOption.subject = subject;
    mailOption.html = html;
    transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.error(error,info);
        }
    });
}

var beatOption = {
    host:'127.0.0.1',  
    path:'/dongfou/beat',  
    method:'get',  
};

function check(){
    //check feedback
    var sql = "select * from t_feedback where status=0";
    var updateSql = "update t_feedback set status=1 where id=?";
    db.query(sql, [], function(err, rows){
        if(err){
        }else{
            content = '';
            for(var i=0;i<rows.length;i++){
                row = rows[i];
                id = row['id']
                content += row['content']+"\n";
                db.query(updateSql, [id], function(err, rows){
                    if(err){
                        console.log(err)    
                    }
                });
            }
            if(content!='')
                send('feedback',content);
        }
    });
    
    //check web service
    
    var req=http.request(beatOption,function(res){  
        
        res.setEncoding('utf-8');  
        res.on('data',function(data){  
            if(data!='ok'){
                sendHtml('beat test',data);
            }else{
                console.log(data);
            }
        });  

    });
    
    req.on('error',function(e){
        console.log(new Date()+ " :"+e.message);
        send('beat test',e.message);
    });
    req.end();
    
    setTimeout(check,60000);
}

check();


