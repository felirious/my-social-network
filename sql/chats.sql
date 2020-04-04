DROP TABLE IF EXISTS chats;
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL,
    userid INT NOT NULL REFERENCES users(userid),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chats (message, userid) VALUES ('hi whazzup', '2');
INSERT INTO chats (message, userid) VALUES ('hi yoooo whazzup', '3');
INSERT INTO chats (message, userid) VALUES ('hi whazzup', '4');
INSERT INTO chats (message, userid) VALUES ('hi whazzup', '5');
