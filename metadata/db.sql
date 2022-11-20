DROP DATABASE IF EXISTS ourfonts;

CREATE DATABASE ourfonts WITH ENCODING = 'UTF8';

CREATE TABLE fonts (
	id serial NOT NULL,
	name varchar(255) NOT NULL,
	nftId varchar(255) NOT NULL,
	PRIMARY KEY(id)
)

INSERT INTO fonts (name, nftid)
VALUES ('stelar', '3'),
('steplar', '7'),
('stepcloser', '36'),
('times', '45'),
('timeout', '27'),
('timcook', '89'),
('timing', '74');

SELECT * from fonts WHERE name LIKE 'tim%'