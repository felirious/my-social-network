DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    receiver_id INT NOT NULL REFERENCES users(userid),
    sender_id INT NOT NULL REFERENCES users(userid),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('2', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('3', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('4', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('1', '5', 'false');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('1', '6', 'false');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('1', '7', 'false');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('1', '8', 'false');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('200', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('201', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('202', '1', 'true');
INSERT INTO friendships (receiver_id, sender_id, accepted) VALUES ('204', '1', 'true');
