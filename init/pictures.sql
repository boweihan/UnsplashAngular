DROP DATABASE IF EXISTS pictures;
CREATE DATABASE pictures;

\c pictures;

CREATE TABLE pics (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  description VARCHAR,
  img VARCHAR,
  user_id VARCHAR
);

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  password VARCHAR,
  token VARCHAR,
  username VARCHAR
);

INSERT INTO pics (name, description, img, user_id)
  VALUES ('TestPicture1', 'description for p1', 'n/a', '1');

INSERT INTO users (email, password)
  VALUES ('test@test.com', 'test');
