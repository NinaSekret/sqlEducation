CREATE SCHEMA IF NOT EXISTS blogs;

CREATE  TABLE users (
	email                text   ,
	token                text   ,
	username             text   ,
	image                text   ,
	id                   uuid  NOT NULL ,
	CONSTRAINT unq_users_id UNIQUE ( id )
 );

CREATE  TABLE profiles (
	username             varchar(100)   ,
	bio                  text   ,
	image                text   ,
	following            boolean   ,
	id                   uuid  NOT NULL ,
	user_id              uuid  NOT NULL ,
	CONSTRAINT unq_profiles_id UNIQUE ( id ) ,
	CONSTRAINT unq_profiles_user_id UNIQUE ( user_id ) ,
	CONSTRAINT fk_profiles_users_id FOREIGN KEY ( user_id ) REFERENCES users( id )
 );

CREATE  TABLE articles (
	slug                 text   ,
	title                text   ,
	description          text   ,
	created_at           time   ,
	updated_at           date   ,
	favorited            boolean   ,
	favoritescount       integer   ,
	id                   uuid  NOT NULL ,
	author_id            uuid   ,
	CONSTRAINT fk_article_profiles FOREIGN KEY ( author_id ) REFERENCES profiles( id )
 );

CREATE  TABLE comments (
	id                   uuid  NOT NULL ,
	created_at           time   ,
	updated_at           time   ,
	body                 text   ,
	author_id            uuid  NOT NULL ,
	CONSTRAINT fk_comments_profiles FOREIGN KEY ( id ) REFERENCES profiles( id )
 );

