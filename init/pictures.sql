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

INSERT INTO pics (name, description, urls, user_id)
  VALUES ('TestPicture1', 'description for p1', 'https://3.bp.blogspot.com/-W__wiaHUjwI/Vt3Grd8df0I/AAAAAAAAA78/7xqUNj8ujtY/s1600/image02.png', 1);

INSERT INTO users (email, password)
  VALUES ('test@test.com', 'test');
