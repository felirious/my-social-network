const spicedPg = require("spiced-pg");

// // if you're requiring password from a secrets.json, then
// let db;
// if(process.env.DATABASE_URL) {db = spicedPg(process.env.DATABASE_URL)} else ...
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/social-network"
);

exports.addUser = function(first, last, email, hashedPw) {
    return db.query(
        `INSERT INTO users (first, last, email, hashedPw) VALUES
        ($1, $2, $3, $4)
        RETURNING *`,
        [first || null, last || null, email, hashedPw]
    );
};

exports.getPasswordFromEmail = function(email) {
    return db.query(`SELECT hashedPw, userID FROM users WHERE email=($1)`, [
        email
    ]);
};

exports.storeSecretCode = function(code, email) {
    return db.query(
        `INSERT INTO password_reset_codes (code, email) VALUES
    ($1, $2)
    RETURNING *`,
        [code, email]
    );
};

exports.getCode = function(email) {
    return db.query(`SELECT code FROM password_reset_codes WHERE email=($1)`, [
        email
    ]);
};

exports.changePassword = function(password, email) {
    return db.query(
        `UPDATE users SET hashedPw=$1
        WHERE email=$2`,
        [password, email]
    );
};

exports.getUserInfo = function(userid) {
    return db.query(`SELECT * FROM users WHERE userid=($1)`, [userid]);
};

exports.insertImageIntoDB = function(url, userid) {
    return db.query(
        `UPDATE users SET profile_pic=$1
    WHERE userid=$2 RETURNING *`,
        [url, userid]
    );
};

exports.updateBio = function(id, bio) {
    return db.query(
        `
        UPDATE users
        SET bio = $2
        WHERE userid = $1
        Returning bio
        `,
        [id, bio]
    );
};

exports.allUsers = function() {
    return db.query(
        `
        SELECT * FROM users
        ORDER BY userid DESC
        LIMIT 15
        `
    );
};

exports.findUsers = function(input) {
    return db.query(
        `
        SELECT * FROM users
        WHERE first ILIKE $1
        ORDER BY userid DESC
        LIMIT 10
        `,
        [input + "%"]
    );
};

exports.getFriendshipStatus = function(otherUser, loggedInUser) {
    console.log("users: ", otherUser, " , ", loggedInUser);
    return db.query(
        `
SELECT * FROM friendships
WHERE (receiver_id = $1 AND sender_id = $2)
OR (receiver_id = $2 AND sender_id = $1)
        `,
        [otherUser, loggedInUser]
    );
};

exports.addFriend = function(otherUser, loggedInUser) {
    console.log("receiver initial: ", otherUser);
    console.log("sender initial: ", loggedInUser);
    return db.query(
        `
        INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2)
        `,
        [otherUser, loggedInUser]
    );
};

exports.acceptRequest = function(otherUser, loggedInUser) {
    return db.query(
        `
        UPDATE friendships SET accepted=true WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        `,
        [otherUser, loggedInUser]
    );
};

exports.cancelFriendRequest = function(otherUser, loggedInUser) {
    return db.query(
        `
        DELETE FROM friendships WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)
        `,
        [otherUser, loggedInUser]
    );
};

exports.getFriendsAndWannabes = function(userid) {
    return db.query(
        `
      SELECT users.userid, first, last, profile_pic, accepted
      FROM friendships
      JOIN users
      ON (accepted = false AND receiver_id = $1 AND sender_id = users.userid)
      OR (accepted = true AND receiver_id = $1 AND sender_id = users.userid)
      OR (accepted = true AND sender_id = $1 AND receiver_id = users.userid)
`,
        [userid]
    );
};

exports.getRecentChats = function() {
    return db.query(`SELECT chats.message AS message, users.userid AS id, users.first AS first, users.last AS last, users.profile_pic AS profile_pic
        FROM users
        JOIN chats
        ON chats.userid = users.userid
        ORDER BY chats.id ASC
        LIMIT 10
        `);
};

exports.newMessage = function(msg, userid) {
    return db.query(`INSERT INTO chats (message, userid) VALUES ($1, $2)`, [
        msg,
        userid
    ]);
};

exports.userInfo = function(userid) {
    return db.query(`SELECT * FROM users WHERE userid = $1`, [userid]);
};
