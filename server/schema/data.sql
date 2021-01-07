delete from users ;
delete from comments;
delete from keyvals;
alter table users auto_increment=1 ;
alter table comments auto_increment=1 ;


insert into users (email,name) values ("joe@example.com", "Joe User") ;
insert into users (email,name) values ("sally@example.com", "Sally User") ;
insert into users (email,name) values ("gene@example.com", "Gene User") ;

insert into comments (mp3,userid,data,dt) values("0101-01.mp3",1,"oh wow this is cool","2021-01-01 00:00:00");
insert into comments (mp3,userid,data,dt) values("0101-01.mp3",2,"it's wonderful to hear them again after so much time","2021-01-01 01:00:00");
insert into comments (mp3,userid,data,dt) values("0101-01.mp3",3,"who is that singing???","2021-01-01 02:00:00");


insert into comments (mp3,userid,data,dt) values("0101-02.mp3",3,"it's wonderful to hear them again after so much time","2021-01-01 03:00:00");
insert into comments (mp3,userid,data,dt) values("0101-02.mp3",1,"who is that singing???","2021-01-01 04:00:00");
insert into comments (mp3,userid,data,dt) values("0101-02.mp3",2,"oh wow this is cool","2021-01-01 05:00:00");

insert into comments (mp3,userid,data,dt) values("0101-03.mp3",1,"it's wonderful to hear them again after so much time","2021-01-01 06:00:00");
insert into comments (mp3,userid,data,dt) values("0101-03.mp3",3,"oh wow this is cool","2021-01-01 07:00:00");
insert into comments (mp3,userid,data,dt) values("0101-03.mp3",2,"who is that singing???","2021-01-01 08:00:00");

insert into likes (userid,mp3) values (1,"0101-01.mp3") ;
insert into likes (userid,mp3) values (2,"0101-01.mp3") ;
insert into likes (userid,mp3) values (3,"0101-02.mp3") ;
insert into likes (userid,mp3) values (1,"0101-03.mp3") ;
