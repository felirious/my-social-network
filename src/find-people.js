import React, { useState, useEffect } from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchItem, setSearchItem] = useState([]);
    const searchChange = ({ target }) => {
        // console.log("target.value: ", target.value);
        setSearchItem(target.value);
        // console.log("searchItem: ", searchItem);
    };
    useEffect(() => {
        let abort;
        if (searchItem == "") {
            axios.get(`/api/users`).then(({ data }) => {
                // console.log("response from useEffect: ", data);
                if (!abort) {
                    setUsers(data);
                }
            });
        } else {
            axios.get(`/api/usersearch/${searchItem}`).then(({ data }) => {
                // console.log("response from GET usersearch: ", data);
                if (!abort) {
                    setUsers(data);
                }
            });
        }
    }, [searchItem]);
    return (
        <div>
            <h2>Voilà a list of the users that joined most recently:</h2>
            <div id="find-results-container">
                {users &&
                    users.map(users => (
                        <div id="find-results-item" key={users.userid}>
                            <img
                                id="find-image"
                                src={users.profile_pic || "default.jpg"}
                            />
                            <Link to={`/user/${users.userid}`}>
                                {users.first} {users.last}
                            </Link>
                        </div>
                    ))}
            </div>
            <br />
            <br />
            <br />
            <h3>
                Looking for a specific person? You might wanna type your search
                item here:
            </h3>
            <br />
            <br />
            <input
                onChange={searchChange}
                type="text"
                placeholder="Your search item"
            />
        </div>
    );
}
