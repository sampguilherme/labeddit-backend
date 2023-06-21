-- Active: 1685984988333@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    nickname TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')) NOT NULL
);

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    comments INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    updated_at TEXT DEFAULT(DATETIME('now','localtime')),
    creator_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

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

ALTER TABLE likes_dislikes RENAME TO likes_dislikes_posts;

SELECT * FROM likes_dislikes_posts;

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    created_at TEXT DEFAULT(DATETIME('now', 'localtime')),
    updated_at TEXT DEFAULT(DATETIME('now','localtime')),
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes_comments(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


SELECT * FROM posts; 