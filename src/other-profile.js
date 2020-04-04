import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic.js";
import FriendButton from "./friend-button.js";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        // console.log("params: ", this.props.match.params.id);
        axios
            .get(`/api/user/${this.props.match.params.id}`)
            .then(({ data }) => {
                // console.log("state before: ", this.state);
                // check if the id in the url belongs to the logged in user (optional)
                if (data.error) {
                    console.log("error: ", data.error);
                    this.props.history.push("/");
                } else if (!data) {
                    // some test to determine a user was not found
                    this.setState({
                        error: true
                    });
                } else {
                    this.setState({
                        profile_pic: data.profile_pic,
                        first: data.first,
                        last: data.last,
                        bio: data.bio,
                        userid: data.userid
                    });
                }
                // console.log("state after: ", this.state);
            })
            .catch(err => {
                console.log("err: ", err);
            });
    }
    render() {
        return (
            <div>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.profile_pic}
                />
                <h2>{`${this.state.first} ${this.state.last}`}</h2>
                <h3>{`${this.state.bio}`}</h3>
                <FriendButton otherUser={this.props.match.params.id} />
            </div>
        );
    }
}
