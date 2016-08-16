DROP DATABASE IF EXISTS pictures;
CREATE DATABASE pictures;

\c pictures;

CREATE TABLE pics (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  img VARCHAR
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  password VARCHAR,
  token VARCHAR,
  username VARCHAR
);

INSERT INTO pics (name, description, img)
  VALUES ('TestPicture1', 'description for p1', 'n/a');

INSERT INTO users (email, password)
  VALUES ('test@test.com', 'test');
