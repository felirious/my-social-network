import * as io from "socket.io-client";
import { fetchMessages, newMessage } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("fetchMessages", msgs => store.dispatch(fetchMessages(msgs)));

        socket.on("newChatMessage", msg => {
            console.log("msg: ", msg);
            store.dispatch(newMessage(msg));
        });
    }
};

// socket.on("muffinMagic", myMuffin => {
//     console.log("myMuffin: ", myMuffin);
// });
