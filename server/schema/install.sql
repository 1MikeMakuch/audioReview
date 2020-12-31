drop database if exists dt ;
CREATE DATABASE IF NOT EXISTS dt DEFAULT CHARSET=utf8;

GRANT ALL ON dt.* to 'dt'@'localhost' identified by 'dt';
GRANT ALL ON dt.* to 'dt'@'%' identified by 'dt';

USE dt;

-- SOURCE schema.sql;
