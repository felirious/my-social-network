// a container, or smart, component

import React from "react";
import axios from "./axios.js";
import ProfilePic from "./profile-pic.js";
import Uploader from "./uploader.js";
import Profile from "./profile.js";
import BioEditor from "./bio-editor.js";
import OtherProfile from "./other-profile.js";
import { BrowserRouter, Route } from "react-router-dom";
import FindPeople from "./find-people.js";
import Friends from "./friends.js";
import Chat from "./chats.js";
import Navigator from "./navbar.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploader: false,
            profile_pic: "./default.jpg",
            default_pic: "./default.jpg",
            bio: ""
        };
        this.closeModal = this.closeModal.bind(this);
        this.submitUpload = this.submitUpload.bind(this);
    }
    // componentDidMount only runs once, right after component has rendered for the first time
    componentDidMount() {
        // console.log("component mounted");
        axios.get("/user").then(({ data }) => {
            //database query by userid (which is stored in the cookie)
            this.setState({
                ...data[0]
            });
            // console.log("initial state: ", this.state);
        });
    }
    // declare inside sub-component so you can pass it as a prop
    // clickPic() {
    //     this.setState({
    //         uploader: true
    //     });
    //     console.log("hi");
    // }
    submitUpload(file) {
        // e.preventDefault();
        var formData = new FormData();
        formData.append("file", file);
        axios
            .post("/upload", formData)
            .then(resp => {
                console.log("stuff just happened");
                console.log("new profile pic URL: ", resp.data.profile_pic);
                console.log("state before set: ", this.state);
                this.setState({
                    profile_pic: resp.data.profile_pic,
                    uploader: false
                });
            })
            .catch(err => {
                console.log("err in POST /upload: ", err);
            });
    }
    closeModal() {
        this.setState({
            uploader: false
        });
    }
    render() {
        // to prevent from rendering before mounted function has run /fetched data
        if (!this.state.userid) {
            return <img src="/progressbar.gif" alt="Loading..." />;
        }
        return (
            <div>
                <Navigator />
                <h2 id="title">
                    WELCOME TO
                    <img id="logo" src="/logo.png" alt="logo" />
                </h2>
                <BrowserRouter>
                    <Route exact path="/user/:id" component={OtherProfile} />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                image={this.state.image}
                                onClick={this.showUploader}
                                bio={this.state.bio}
                                setBio={this.setBio}
                                ProfilePic={
                                    <ProfilePic
                                        first={this.state.first}
                                        last={this.state.last}
                                        url={this.state.profile_pic}
                                        clickPic={() => {
                                            this.setState({
                                                uploader: true
                                            });
                                        }}
                                    />
                                }
                                BioEditor={
                                    <BioEditor
                                        bio={this.state.bio}
                                        setBio={newBio => {
                                            this.state({
                                                bio: newBio
                                            });
                                        }}
                                    />
                                }
                            />
                        )}
                    />
                    <Route exact path="/users" component={FindPeople} />
                    <Route exact path="/friends" render={() => <Friends />} />
                    <Route exact path="/chat" render={() => <Chat />} />
                </BrowserRouter>

                <p>
                    <br />
                    <br />
                    <br />
                    <a id="logout" href="/logout">
                        Logout
                    </a>
                    <br />
                    <br />
                    <br />
                    <br />
                </p>
                <footer> (C) Skatebook 2020</footer>

                {this.state.uploader && (
                    <Uploader
                        handleChange={e => {
                            e.preventDefault();
                            console.log("handleChange is happening");
                            console.log(e.target.files);
                        }}
                        closeModal={this.closeModal}
                        // pass function from parent to sub-component as props
                        submitUpload={this.submitUpload}
                    />
                )}
            </div>
        );
    }
}
