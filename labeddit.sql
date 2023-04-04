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

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    updated_at TEXT DEFAULT(DATETIME('now','localtime')),
    creator_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

INSERT INTO posts (id, creator_id, content, likes, dislikes)
    VALUES
        ('p001', 'u001', 'Testes', 0, 0);

SELECT * FROM posts;

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
    ("u002", "p001", 1),
    ("u003", "p001", 0);

UPDATE posts
SET dislikes = 1
WHERE id = "p001";