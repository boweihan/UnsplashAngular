DROP DATABASE IF EXISTS pictures;
CREATE DATABASE pictures;

\c pictures;

CREATE TABLE pics (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  urls VARCHAR,
  user_id INTEGER
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  password VARCHAR,
  token VARCHAR,
  username VARCHAR
);
