const express = require("express");
const app = express();
const compression = require("compression");
const { hash, compare } = require("./utils/bcrypt.js");
const db = require("./database.js");
// const chalk = require("chalk");
const cookieSession = require("cookie-session");
const secrets = require("./utils/secrets.json");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses.js");
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

////////////////////////////////////////////////
///// file upload boilerplate //////////////////
////////////////////////////////////////////////

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    // create unique identifier so you can upload one image multiple times without throwing errors
    filename: function(req, file, callback) {
        uidSafe(24)
            .then(function(uid) {
                callback(null, uid + path.extname(file.originalname));
            })
            .catch(err => {
                console.log("error in file upload: ", err);
            });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        // 2 MB
        fileSize: 2097152
    }
});

////////////////////////////////////////////////
///// file upload boilerplate end //////////////
////////////////////////////////////////////////

app.use(compression());

app.use(express.static("./public"));

app.use(
    express.urlencoded({
        extended: false
    })
);

app.use(express.json());

const cookieSessionMiddleware = cookieSession({
    secret: secrets["cookieSessionSecret"],
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.set("x-frame-option", "deny");
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/registration", (req, res) => {
    // console.log("registration req: ", req.body);
    let { email, password, first, last } = req.body;
    hash(password).then(hashedPw => {
        // console.log(hashedPw);
        db.addUser(first, last, email, hashedPw)
            .then(results => {
                // console.log(chalk.yellow("hi izz me"));
                // console.log("results.rows[0]: ", results.rows[0]);
                // console.log("userID is: ", results.rows[0].userid);
                req.session.userID = results.rows[0].userid;
                // console.log(chalk.red.bgBlue("hi I just registered"));
                res.json({
                    success: true
                });
            })
            .catch(err => {
                console.log("err: ", err);
                res.json({
                    success: false,
                    error: err
                });
            });
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.userID) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    db.getPasswordFromEmail(email)
        .then(results => {
            // console.log("results.rows: ", results.rows);
            var { hashedpw, userid } = results.rows[0];
            compare(password, hashedpw).then(matchValue => {
                if (matchValue == true) {
                    req.session.userID = userid;
                    res.json({
                        success: true
                    });
                } else {
                    // if they don't match, send error message
                    res.json({
                        success: false
                    });
                }
            });
        })
        .catch(err => {
            console.log("err in chain: ", err);
            res.json({
                success: false,
                err: err
            });
        });
});

app.post("/reset-password", (req, res) => {
    // console.log("req.body", req.body);
    var email = req.body.email;
    db.getPasswordFromEmail(email)
        .then(() => {
            const secretCode = cryptoRandomString({
                length: 6
            });
            db.storeSecretCode(secretCode, email).catch(err => {
                console.log("err in secret code: ", err);
                res.json({
                    error: "Oops, something went wrong. Please try again."
                });
            });
            res.json({
                success: true
            });
            let to = email;
            let subject = "Password reset from Customer Service";
            let message =
                "You will be asked to enter the following code: " + secretCode;
            ses.sendEmail(to, subject, message);
        })
        .catch(err => {
            console.log("err in reset db request: ", err);
            res.json({
                error:
                    "The email you just submitted doesn't correspond to any of the accounts in our database. Please try again."
            });
        });
});

app.post("/reset-password/code", (req, res) => {
    var { email, code, password } = req.body;
    // console.log("req.body: ", req.body, password, code);
    db.getCode(email).then(({ rows }) => {
        if (rows.length == 1) {
            if (rows[0].code === code) {
                // console.log("equal!!");
                hash(password)
                    .then(hashedPw => {
                        // console.log("hashedPw1: ", hashedPw);
                        db.changePassword(hashedPw, email)
                            .then(() => {
                                // console.log("success is true");
                                res.json({
                                    success: true
                                });
                            })
                            .catch(err => {
                                console.log("err: ", err);
                                res.json({
                                    success: false,
                                    err: err
                                });
                            });
                    })
                    .catch(err => {
                        console.log("err: ", err);
                        res.json({
                            success: false,
                            err: err
                        });
                    });
            }
        } else {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].code === code) {
                    // console.log("equal!!");
                    hash(password)
                        .then(hashedPw => {
                            // console.log("hashedPw2: ", hashedPw);
                            db.changePassword(hashedPw, email)
                                .then(() => {
                                    // console.log("success is true");
                                    res.json({
                                        success: true
                                    });
                                })
                                .catch(err => {
                                    console.log("err: ", err);
                                    res.json({
                                        success: false,
                                        err: err
                                    });
                                });
                        })
                        .catch(err => {
                            console.log("err: ", err);
                            res.json({
                                success: false,
                                err: err
                            });
                        });
                }
            }
        }
    });
});

////////////////////////////////////////////////////////////////////////////////
///////////////// post route for upload ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// multer stuff and then the function that's defined in s3.js
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("input: ", req.body);
    // console.log("req.session.userid: ", req.session.userID);
    let userid = req.session.userID;
    let url = s3Url + req.file.filename;
    // console.log(chalk.blue.bgRed("URL: "));
    // console.log("url: ", url);
    if (req.file) {
        db.insertImageIntoDB(url, userid)
            .then(({ rows }) => {
                // console.log("image was inserted");
                // console.log("rows: ", rows);
                res.json(rows[0]);
            })
            .catch(err => {
                console.log("err insert failed", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});
////////////////////////////////////////////////////////////////////////////////
///////////////// post route for upload ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get("/logout", (req, res) => {
    req.session.userID = null;
    res.redirect("/welcome");
});

app.get("/user", (req, res) => {
    // console.log("get request to /user");
    // console.log("userid: ", req.session.userID);
    let userid = req.session.userID;
    db.getUserInfo(userid).then(({ rows }) => {
        // console.log("rows: ", rows);
        res.json(rows);
    });
});

app.post("/updatebio", (req, res) => {
    const { bio } = req.body;
    // console.log("bio:", bio);
    db.updateBio(req.session.userID, bio)
        .then(({ rows }) => {
            // console.log("bio update was successful");
            res.json({ bio: rows[0].bio });
        })
        .catch(error => console.log("error in updateBio:", error));
});

app.get("/api/user/:id", (req, res) => {
    // console.log("hi this is a get request to /user/:id");
    let id = req.params.id;
    // console.log("params: ", req.params);
    let currentid = req.session.userID;
    db.getUserInfo(id)
        .then(({ rows }) => {
            // console.log("rows: ", rows[0]);
            if (id == currentid) {
                // console.log("IDs are equal");
                res.json({
                    error: true
                });
            } else {
                res.json(rows[0]);
            }
        })
        .catch(err => {
            console.log("err: ", err);
            res.json({
                success: false,
                error: err
            });
        });
});

app.get("/api/users", (req, res) => {
    // console.log("GET to /api/users");
    db.allUsers().then(({ rows }) => {
        // console.log("response from GET /users: ", rows);
        res.json(rows);
    });
});

app.get("/api/users", (req, res) => {
    // console.log("GET to /api/users");
    db.allUsers().then(({ rows }) => {
        // console.log("response from GET /users: ", rows);
        res.json(rows);
    });
});

app.get("/api/usersearch/:searchItem", (req, res) => {
    // console.log("GET to /api/usersearch");
    // console.log("*******searchItem: ********", req.params);
    db.findUsers(req.params.searchItem).then(({ rows }) => {
        // console.log("response from GET /users: ", rows);
        res.json(rows);
    });
});

app.get("/friendship-status/:otherUser", (req, res) => {
    let { otherUser } = req.params;
    // console.log("otherUser initial: ", otherUser);
    let loggedInUser = req.session.userID;
    // console.log("loggedInUser initial: ", loggedInUser);
    db.getFriendshipStatus(otherUser, loggedInUser).then(({ rows }) => {
        res.json(rows);
    });
});

app.post("/add-friend/:otherUser", (req, res) => {
    console.log("hi request to add-friend");
    let { otherUser } = req.params;
    console.log("otherUser: ", otherUser);
    let loggedInUser = req.session.userID;
    console.log("loggedInUser: ", loggedInUser);
    db.addFriend(otherUser, loggedInUser).then(() => {
        res.json({
            success: true
        });
    });
});

app.post("/accept-request/:otherUser", (req, res) => {
    // console.log(
    //     "**********otherUser: **********************",
    //     req.params.otherUser
    // );
    let { otherUser } = req.params;
    let loggedInUser = req.session.userID;
    db.acceptRequest(otherUser, loggedInUser).then(() => {
        res.json({
            success: true
        });
    });
});

app.post("/cancel-friend-request/:otherUser", (req, res) => {
    // console.log("cancel request received");
    // console.log("otherUser: ", req.params.otherUser);
    let { otherUser } = req.params;
    let loggedInUser = req.session.userID;
    db.cancelFriendRequest(otherUser, loggedInUser).then(() => {
        res.json({
            success: true
        });
    });
});

app.get("/get-friends-wannabes", (req, res) => {
    // console.log("friends wannabes route");
    let loggedInUser = req.session.userID;
    db.getFriendsAndWannabes(loggedInUser).then(({ rows }) => {
        res.json({
            rows,
            success: true
        });
    });
});

//////// DON'T TOUCH ///////////////////////////////////////////////////////////
app.get("*", function(req, res) {
    if (!req.session.userID) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
//////// DON'T TOUCH ///////////////////////////////////////////////////////////

server.listen(8080, function() {
    console.log("I'm listening.");
});

///////////////////////// SERVER-SIDE IO ///////////////////////////////////////
io.on("connection", function(socket) {
    // console.log("sanity check socket ${socket.id}");
    if (!socket.request.session.userID) {
        return socket.disconnect(true);
    }
    //
    // const userid = socket.request.session.userID;

    db.getRecentChats()
        .then(data => {
            // console.log("data: ", data.rows);
            io.sockets.emit("fetchMessages", data.rows);
        })
        .catch(err => {
            console.log("error in recent chats: ", err);
        });

    // socket.on("muffin", data => {
    //     console.log("my muffin on the server: ", data);
    //     io.sockets.emit("muffinMagic: ", data);
    // });

    socket.on("newMessage", async function(newMsg) {
        let userid = socket.request.session.userID;
        // console.log("new message from chats.js component: ", newMsg, userid);
        // console.log("data.rows: ", data.rows);
        let { rows } = await db.userInfo(userid);
        await db.newMessage(newMsg, userid);
        let newMessageObject = {
            message: newMsg,
            id: rows[0].userid,
            first: rows[0].first,
            last: rows[0].last,
            profile_pic: rows[0].profile_pic
        };
        // console.log("newMessageObject: ", newMessageObject);
        io.sockets.emit("newChatMessage", newMessageObject);
    });
});
