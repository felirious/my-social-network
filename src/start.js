import React from "react";
import ReactDOM from "react-dom";
// import axios from "./axios";
import Welcome from "./welcome.js";
import App from "./app.js";
// import Uploader from "./uploader.js";
// import ProfilePic from "./profile-pic.js";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
// import * as io from "socket.io-client";
import { init } from "./sockets.js";
// const socket = io.connect();
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;

if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

// since reactDOM can only render one component, need variable that determines which one to render
let component;

if (location.pathname === "/welcome") {
    //render registration page or login
    component = <Welcome />;
} else {
    // render logo
    component = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(component, document.querySelector("main"));
