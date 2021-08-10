
-- tiny blob    255b
-- blob         64kb
-- mediumblob   16Mb
-- longblob     5Gb

-- drop table if exists keyvals;
create table keyvals (
    id varchar(255) not null,
    data varchar(1024) default null,
    primary key(id),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- drop table if exists comments;
create table comments (
    id int(11) not null auto_increment,
    userid int(11) not null,
    mp3 varchar(50) not null,
    data varchar(512) not null,
    primary key(id),
    key mp3 (mp3),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP,
    udt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- drop table if exists users;
create table users (
    id int(11) not null auto_increment,
    email varchar(512) not null,
    name varchar(512) not null,
--    password varchar(255) not null,
    primary key(id),
    unique key email (email),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- drop table if exists likes;
create table likes (
    userid int(11) not null,
    mp3 varchar(50) not null,
    primary key(userid,mp3),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- drop table if exists ips;
create table ips (
    email varchar(200) not null,
    ip varchar(50) not null,
    primary key(email),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

