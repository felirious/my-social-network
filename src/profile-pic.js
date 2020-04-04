// a presentational, or "dumb", component
import React from "react";

export default function ProfilePic({
    url = "./default.jpg",
    first,
    last,
    clickPic
}) {
    if (url) {
        return (
            <div>
                <br />
                <img
                    id="profile-pic"
                    src={url}
                    alt={`${first} ${last}`}
                    onClick={clickPic}
                />
                <br />
            </div>
        );
    } else {
        return (
            <div>
                <br />
                <img
                    id="profile-pic"
                    src="default.jpg"
                    alt={`${first} ${last}`}
                    onClick={clickPic}
                />
                <br />
            </div>
        );
    }
}
