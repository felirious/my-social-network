import React from "react";
// import { Link } from "react-router-dom";

export default function Navigator() {
    return (
        <div id="navbar">
            <div id="navlink-container">
                <a id="navlink" href="/">
                    MY PROFILE
                </a>
            </div>
            <div id="navlink-container">
                <a id="navlink" href="/users">
                    FIND PEOPLE
                </a>
            </div>
            <div id="navlink-container">
                <a id="navlink" href="/friends">
                    MY FRIENDS
                </a>
            </div>
            <div id="navlink-container">
                <a id="navlink" href="/chat">
                    CHAT ROOM
                </a>
            </div>
        </div>
    );
}
