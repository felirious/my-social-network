import axios from "./axios";
import reducer from "./reducer.js";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/get-friends-wannabes");
    // console.log("data: ", data.rows);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data.rows
    };
}

export async function acceptFriendRequest(otherUser) {
    await axios.post("/accept-request/" + otherUser);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id: otherUser
    };
}

export async function unfriend(otherUser) {
    console.log("otherUser: ", otherUser);
    await axios.post("/cancel-friend-request/" + otherUser);
    return {
        type: "UNFRIEND",
        id: otherUser
    };
}

export function fetchMessages(msgs) {
    return {
        type: "RECENT_CHATS",
        messages: msgs
    };
}

export function newMessage(msg) {
    return {
        type: "NEW_MESSAGE",
        message: msg
    };
}
