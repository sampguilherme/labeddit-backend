-- Active: 1678835586943@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

INSERT INTO users(id, nickname, email, password)
VALUES
    ('u001', 'Guilherme', 'guilherme@email.com', 'guilherme2003'),
    ('u002', 'Geovanna', 'geovanna@email.com', 'geovanna2004'),
    ('u003', 'Fulano', 'fulano@email.com', 'fulano2002');

DROP TABLE users;

SELECT * FROM users;

UPDATE users
SET password = "$2y$12$mez/RUyqUnZpYUtkQ38Te.jRE7TagJ1xGvLJukTW15IsYdC.tflIC"
WHERE id = "u003";

SELECT * FROM users;