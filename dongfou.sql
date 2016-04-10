use test;

-- drop table t_sport;
create table `t_sport`(
    id int not null auto_increment,
    name varchar(50) not null,
    image varchar(150),
    kind int not null,
    unit varchar(50) not null,
    maxnum int not null,
    unit2 varchar(50),
    maxnum2 int not null,
    primary key (id)
)
COLLATE='utf8_unicode_ci';

-- drop table t_sport_record;
create table `t_sport_record`(
    seq int not null auto_increment,
    userid int not null,
    sportid int not null,
    amount float not null,
    arg1 float not null,
    arg2 float not null,
    time datetime not null,
    primary key (seq)
)
COLLATE='utf8_unicode_ci';

-- drop table t_token;
create table `t_token`(
    userid int not null,
    token varchar(50) not null,
    time datetime not null,
    primary key (userid)
)
COLLATE='utf8_unicode_ci';

-- drop table t_feedback;
create table `t_feedback`(
    id int not null auto_increment,
    userid int not null,
    content varchar(1000) not null,
    time datetime not null,
    status int not null default 0,
    primary key (id)
)
COLLATE='utf8_unicode_ci';

create table `t_dongfou_user`(
    id int not null auto_increment,
    mail varchar(50) not null,
    passwd varchar(50) not null,
    primary key (id)
)
COLLATE='utf8_unicode_ci';

drop table t_dongfou_notice;
create table `t_dongfou_notice`(
    id int not null auto_increment,
    kind int not null,
    title varchar(50) not null,
    time datetime not null,
    url varchar(50) not null,
    arg1 int,
    arg2 varchar(50),
    primary key (id)
)
COLLATE='utf8_unicode_ci';
insert into t_dongfou_notice values(1,1,'动否0.0.1主要更新',now(),'http://www.pgyer.com/dongfou', 1, "");
insert into t_dongfou_notice values(2,1,'动否0.0.2主要更新',now(),'http://www.pgyer.com/dongfou', 2, "");
insert into t_dongfou_notice values(3,1,'动否0.0.3主要更新',now(),'http://www.pgyer.com/dongfou', 3, "");

create table `t_dongfou_version`(
    versioncode int not null,
    versionname varchar(50) not null
)
COLLATE='utf8_unicode_ci';
-- insert into t_dongfou_version values(2,'0.0.2');

create table `t_dongfou_sign`(
    userid int not null,
    deviceid varchar(50) not null,
    versioncode int not null,
    time datetime not null,
    index (userid,deviceid)
)
COLLATE='utf8_unicode_ci';


-- insert into t_sport values(1,'跑步','1.jpg',1,'公里',100,"",0);
-- insert into t_sport values(2,'徒手深蹲','1.jpg',1,'次',500,"",0);
-- insert into t_sport values(3,'负重深蹲','1.jpg',2,"次",500,"千克",200);
-- insert into t_sport values(4,'飞鸟','1.jpg',2,"次",500,'千克',200);
-- insert into t_sport values(5,'45度飞鸟','1.jpg',2,"次",500,'千克',200);
-- insert into t_sport values(6,'卧推','1.jpg',2,"次",500,'千克',200);
-- insert into t_sport values(8,'俯卧撑','1.jpg',1,"次",1000,'',0);
-- insert into t_sport values(9,'上斜俯卧撑','1.jpg',1,"次",600,'',0);
-- insert into t_sport values(10,'下斜俯卧撑','1.jpg',1,"次",600,'',0);
-- insert into t_sport values(11,'仰卧起坐','1.jpg',1,"次",1000,'',0);
-- insert into t_sport values(12,'引体向上','1.jpg',1,"次",600,'',0);
-- insert into t_sport values(13,'负重引体向上','1.jpg',2,"次",500,'千克',100);
-- insert into t_sport values(14,'举腿','1.jpg',1,"次",500,'',0);
-- insert into t_sport (name,image,kind,unit,maxnum,unit2,maxnum2)values('上斜卧推','shangwotui.png',2,"次",200,'千克',200);
-- insert into t_sport (name,image,kind,unit,maxnum,unit2,maxnum2)values('下斜卧推','xiawotui.png',2,"次",200,'千克',200);
-- insert into t_sport (name,image,kind,unit,maxnum,unit2,maxnum2)values('腹肌轮','fujilun.png',1,"次",500,'',0);
-- insert into t_sport (name,image,kind,unit,maxnum,unit2,maxnum2)values('跳绳','tiaoshen.png',1,"次",1000,'',0);

