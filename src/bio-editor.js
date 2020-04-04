import React from "react";
import axios from "./axios.js";
// import { Link } from "react-router-dom";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            bioEditor: false,
            bio: ""
        };
        this.uploadBio = this.uploadBio.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.toggleEditor = this.toggleEditor.bind(this);
    }
    componentDidMount() {
        this.setState({
            bioEditor: false
        });
        if (this.props.bio == null || "") {
            console.log("user has no bio");
            return;
        } else {
            this.setState({
                bio: this.props.bio
            });
        }
    }
    uploadBio(e) {
        e.preventDefault();
        axios
            .post("/updatebio", { bio: this.state.bio })
            .then(({ data }) => {
                this.toggleEditor();
                console.log("POST /bio response:", data.bio);
                this.props.setBio(data.bio);
            })
            .catch(error => console.log("error in uploadBio:", error));
    }
    updateBio(e) {
        e.preventDefault();
        this.setState(
            {
                bio: e.target.value
            },
            () => console.log("this.state.bio:", this.state.bio)
        );
    }
    toggleEditor() {
        this.setState({ bioEditor: !this.state.bioEditor });
    }
    render() {
        return (
            <div>
                {!this.state.bioEditor && this.state.bio && (
                    <div>
                        <p>{this.state.bio}</p>
                        <button onClick={this.toggleEditor}>Edit bio</button>
                    </div>
                )}
                {!this.state.bioEditor && !this.state.bio && (
                    <div>
                        <button onClick={this.toggleEditor}>Add bio</button>
                    </div>
                )}
                {this.state.bioEditor && (
                    <div>
                        <textarea
                            value={this.state.bio}
                            onChange={this.updateBio}
                            placeholder="Your bio here"
                        ></textarea>
                        <button onClick={this.uploadBio}>Save</button>
                    </div>
                )}
            </div>
        );
    }
}
