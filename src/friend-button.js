import React from "react";
import axios from "./axios.js";
// import { Link } from "react-router-dom";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            buttonText: "Add friend"
        };
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        let otherUser = this.props.otherUser;
        console.log("otherUser: ", otherUser);
        axios
            .get("/friendship-status/" + otherUser)
            .then(({ data }) => {
                if (data.length > 0) {
                    console.log("initial fs status: ", data[0]);
                    console.log("this.props.otherUser: ", this.props.otherUser);
                    console.log("data[0].receiver_id: ", data[0].receiver_id);
                }
                if (data.length == 0) {
                    this.setState({
                        buttonText: "Add friend"
                    });
                } else if (
                    data[0].accepted === false &&
                    this.props.otherUser == data[0].receiver_id
                ) {
                    console.log(
                        "accepted is false and other is receiver, so cancel"
                    );
                    this.setState({
                        buttonText: "Cancel friend request"
                    });
                } else if (
                    data[0].accepted === false &&
                    this.props.otherUser == data[0].sender_id
                ) {
                    console.log(
                        "accepted is false and other is sender, so accept"
                    );
                    this.setState({
                        buttonText: "Accept friend request"
                    });
                } else if (data[0].accepted === true) {
                    console.log("accepted is true, so end");
                    this.setState({
                        buttonText: "End friendship"
                    });
                }
            })
            .catch(err => {
                console.log("err: ", err);
            });
    }
    handleChange(e) {
        console.log("button was clicked!");
        e.preventDefault();
        // console.log("this.state.buttonText: ", this.state.buttonText);
        if (this.state.buttonText == "Add friend") {
            console.log("hi add friend");
            let otherUser = this.props.otherUser;
            console.log("otherUser: ", this.props.otherUser);
            axios
                .post(`/add-friend/${otherUser}`)
                .then(({ data }) => {
                    if (data.success == true) {
                        this.setState({
                            buttonText: "Cancel friend request"
                        });
                    }
                })
                .catch(err => {
                    console.log("err: ", err);
                });
        } else if (this.state.buttonText == "Accept friend request") {
            // do I have to redeclare?
            let otherUser = this.props.otherUser;
            console.log("otherUser: ", otherUser);
            axios.post(`/accept-request/${otherUser}`).then(({ data }) => {
                if (data.success == true) {
                    this.setState({
                        buttonText: "End friendship"
                    });
                }
            });
        } else if (this.state.buttonText == "End friendship") {
            console.log("cancel");
            let otherUser = this.props.otherUser;
            axios
                .post("/cancel-friend-request/" + otherUser)
                .then(({ data }) => {
                    if (data.success == true) {
                        this.setState({
                            buttonText: "Add friend"
                        });
                    }
                });
            this.setState({
                buttonText: "Add friend"
            });
        } else if (this.state.buttonText == "Cancel friend request") {
            let otherUser = this.props.otherUser;
            axios
                .post(`/cancel-friend-request/${otherUser}`)
                .then(({ data }) => {
                    if (data.success == true) {
                        this.setState({
                            buttonText: "Add friend"
                        });
                    }
                });
        }
    }
    render() {
        return (
            <div>
                <button onClick={this.handleChange} name="button">
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
