import React from "react";

export default function Profile({
    first,
    last,
    ProfilePic,
    BioEditor,
    Navigation
}) {
    return (
        <div>
            {Navigator}
            {ProfilePic}
            <h2>{`${first} ${last}`}</h2>
            {BioEditor}
        </div>
    );
}
