delete from users ;
delete from comments;
delete from keyvals;
alter table users auto_increment=1 ;
alter table comments auto_increment=1 ;


insert into users (email,name) values ("joe@example.com", "Joe User") ;
insert into users (email,name) values ("sally@example.com", "Sally User") ;
insert into users (email,name) values ("gene@example.com", "Gene User") ;

insert into comments (mp3,userid,data) values("0101-01.mp3",1,"oh wow this is cool");
insert into comments (mp3,userid,data) values("0101-01.mp3",2,"it's wonderful to hear them again after so much time");
insert into comments (mp3,userid,data) values("0101-01.mp3",3,"who is that singing???");


insert into comments (mp3,userid,data) values("0101-02.mp3",2,"oh wow this is cool");
insert into comments (mp3,userid,data) values("0101-02.mp3",3,"it's wonderful to hear them again after so much time");
insert into comments (mp3,userid,data) values("0101-02.mp3",1,"who is that singing???");

insert into comments (mp3,userid,data) values("0101-03.mp3",3,"oh wow this is cool");
insert into comments (mp3,userid,data) values("0101-03.mp3",1,"it's wonderful to hear them again after so much time");
insert into comments (mp3,userid,data) values("0101-03.mp3",2,"who is that singing???");
