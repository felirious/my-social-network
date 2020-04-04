// reducer function is gonna be passed a state, if it's not passed a state,
// it'll use an empty object (which is what happens befor there is a state)

export default function(state = {}, action) {
    // one if-block for each action-creator
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        // add to new state all users that we're already friends with or that sent us a friend request
        return { ...state, friends: action.friends };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        // add new state which is a copy of the old, except one user has their friendship property set to true
        return {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id == action.id) {
                    return { ...friend, accepted: true };
                } else {
                    return friend;
                }
            })
        };
    }
    if (action.type == "UNFRIEND") {
        console.log("action.id: ", action.id);
        return {
            ...state,
            friends: state.friends.filter(friend => friend.id != action.id)
        };
    }

    if (action.type == "RECENT_CHATS") {
        console.log("fetching recent chats");
        return {
            ...state,
            messages: action.messages
        };
    }

    if (action.type == "NEW_MESSAGE") {
        console.log("new message arrived");
        return {
            ...state,
            messages: [...state.messages, action.message]
        };
    }

    return state;
}
