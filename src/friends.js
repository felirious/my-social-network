import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { store } from "./start.js";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions.js";

export default function Friends() {
    // const [friendChanges, changeFriends] = useState([]);
    const dispatch = useDispatch();
    // const friends = useSelector(state => state && state.friends);

    const friends = useSelector(state => {
        // console.log("state.friends in selector: ", state.friends);
        return (
            state.friends &&
            state.friends.filter(friend => {
                return friend.accepted == true;
            })
        );
    });

    const friend_requests = useSelector(state => {
        return (
            state.friends &&
            state.friends.filter(friend => {
                return friend.accepted == false;
            })
        );
    });

    // console.log("friends: ", friends);
    // console.log("friend requests: ", friend_requests);

    useEffect(() => {
        // console.log("it worked");
        dispatch(receiveFriendsAndWannabes());
    }, [friends]);
    // console.log("friends: ", friends);

    return (
        <div>
            <h2>Friends</h2>
            <div id="friends-container">
                {(friends &&
                    friends.map(friends => (
                        <div id="single-friend" key={friends.userid}>
                            <img
                                id="friends-picture"
                                src={friends.profile_pic || "default.jpg"}
                            />
                            <Link to={`/user/${friends.userid}`}>
                                {friends.first} {friends.last}
                            </Link>
                            <button
                                onClick={() => {
                                    console.log("button was clicked");
                                    dispatch(unfriend(friends.userid));
                                }}
                                type="button"
                                name="button"
                            >
                                Unfriend
                            </button>
                        </div>
                    ))) ||
                    "No friends to show. :("}
            </div>
            <h2>Pending friend requests</h2>
            <div id="friend_requests-container">
                {(friend_requests &&
                    friend_requests.map(friend_requests => (
                        <div
                            id="single-friend_request"
                            key={friend_requests.userid}
                        >
                            <img
                                id="friend_requests-picture"
                                src={
                                    friend_requests.profile_pic || "default.jpg"
                                }
                            />
                            <Link to={`/user/${friend_requests.userid}`}>
                                {friend_requests.first}
                                {friend_requests.last}
                            </Link>
                            <button
                                onClick={() => {
                                    console.log("accept button was clicked");
                                    // console.log(
                                    //     "friends.userid: ",
                                    //     friend_requests.userid
                                    // );
                                    dispatch(
                                        acceptFriendRequest(
                                            friend_requests.userid
                                        )
                                    );
                                }}
                                type="button"
                                name="button"
                            >
                                Accept friend request
                            </button>
                        </div>
                    ))) ||
                    "No current friend requests. :("}
            </div>
        </div>
    );
}
