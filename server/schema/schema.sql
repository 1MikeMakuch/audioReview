
-- tiny blob    255b
-- blob         64kb
-- mediumblob   16Mb
-- longblob     5Gb

drop table if exists keyvals;
create table keyvals (
    id varchar(255) not null,
    data varchar(1024) default null,
    primary key(id),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

drop table if exists comments;
create table comments (
    id int(11) not null auto_increment,
    userid int(11) not null,
    mp3 varchar(50) not null,
    data varchar(512) not null,
    primary key(id),
    key mp3 (mp3),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
drop table if exists users;
create table users (
    id int(11) not null auto_increment,
    email varchar(512) not null,
    name varchar(512) not null,
    primary key(id),
    key email (email),
    dt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
