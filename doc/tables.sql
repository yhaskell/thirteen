drop table if exists comments;
drop table if exists tags;
drop table if exists images;
drop table if exists sessions;
drop table if exists users;

create table users (
  id int auto_increment primary key,
  nick nvarchar(20),
  email nvarchar(100),
  password varchar(42),
  realname nvarchar(255)
);

create table images (
  id int auto_increment primary key,
  type smallint,
  tag int,
  owner int,
  path text,
  description text,
  likes int,
  comments int,
  foreign key (owner) references users(id)
);

create table sessions (
  id int auto_increment primary key,
  owner int,
  expires datetime,
  foreign key (owner) references users(id)
);

create table tags (
  image int,
  tag nvarchar(20),
  primary key (image, tag),
  foreign key (image) references images(id)
);

create table comments (
  id int auto_increment primary key,
  owner int,
  image int,
  text text,
  foreign key (owner) references users(id),
  foreign key (image) references images(id)
);
