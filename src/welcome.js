// contains both login and registration, determines which component to render depending on URL

import React from "react";
import Registration from "./registration.js";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login.js";
import ResetPassword from "./reset-password.js";

export default function Welcome() {
    return (
        <div>
            <h2 id="welcome-title">
                <img src="/logo.png" />
            </h2>
            <h4 id="subheader">The Skateboarding Community</h4>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route component={Login} path="/login" />
                    <Route component={ResetPassword} path="/reset-password" />
                </div>
            </HashRouter>
        </div>
    );
}
