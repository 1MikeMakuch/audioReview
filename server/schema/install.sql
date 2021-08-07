drop database if exists vt ;
CREATE DATABASE IF NOT EXISTS vt DEFAULT CHARSET=utf8;

CREATE USER 'vt'@'%' IDENTIFIED BY 'vt';
GRANT ALL PRIVILEGES ON vt.* to 'vt'@'%' WITH GRANT OPTION;

USE vt;

SOURCE schema.sql;
