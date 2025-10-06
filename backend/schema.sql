create table if not exists users(
    id integer primary key,
    name text not null unique
);

create table if not exists polls(
    id integer primary key,
    userId integer not null,
    question text not null
);

create table if not exists answers(
    id integer primary key,
    pollId integer not null,
    answer text not null
);



create table if not exists votes(
  id integer primary key,
  answerId integer not null,
  userId integer not null
);

insert or replace into users(id, name) values(1, 'rub');
insert or replace into users(id, name) values(2, 'henk');
insert or replace into users(id, name) values(3, 'piet');


insert or replace into polls(id,userId, question) values(1, 1, 'Ga je mee?');
insert or replace into answers(id,pollId, answer) values(1, 1, 'ja');
insert or replace into answers(id,pollId, answer) values(2, 1, 'nee');

insert or replace into polls(id,userId, question) values(2, 1, 'eten?');
insert or replace into answers(id,pollId, answer) values(3, 2, 'pizza');
insert or replace into answers(id,pollId, answer) values(4, 2, 'patat');

insert or replace into votes(id,answerId, userId) values(1, 1, 1);
insert or replace into votes(id,answerId, userId) values(2, 1, 2);
insert or replace into votes(id,answerId, userId) values(3, 2, 3);

insert or replace into votes(id,answerId, userId) values(4, 4, 1);
insert or replace into votes(id,answerId, userId) values(5, 3, 2);
insert or replace into votes(id,answerId, userId) values(6, 3, 3);




