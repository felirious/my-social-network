import React, { useEffect, useRef } from "react";
import { socket } from "./sockets.js";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Chat() {
    // const dispatch = useDispatch();
    const messages = useSelector(state => {
        // console.log("initial state: ", state);
        return state && state.messages;
    });

    // console.log("these are the most recent messages: ", messages);

    const elemRef = useRef();
    // some more stuff

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        }
    }, [messages]);

    const keyCheck = e => {
        // console.log("e.key: ", e.key);
        if (e.key === "Enter") {
            e.preventDefault();
            // console.log("e.target: ", e.target);
            // console.log("e.target.value: ", e.target.value);
            socket.emit("newMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div className="chat">
            <h1>Chat Room</h1>
            <div className="chat-container" ref={elemRef}>
                {(messages &&
                    messages.map(messages => (
                        <div className="single-message" key={messages.id}>
                            <div className="user-info">
                                <img
                                    id="messages-avatar"
                                    src={messages.profile_pic || "default.jpg"}
                                />
                                <Link to={`/user/${messages.id}`}>
                                    {messages.first} {messages.last}
                                </Link>
                            </div>
                            <p id="message-body">{messages.message}</p>
                        </div>
                    ))) ||
                    "No messages yet. :("}
            </div>
            <textarea
                id="chat-text"
                placeholder="Add your message here and start chatting away..."
                onKeyDown={keyCheck}
            />
        </div>
    );
}
