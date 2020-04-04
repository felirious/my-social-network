import React from "react";
import axios from "./axios.js";
// import { Link } from "react-router-dom";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        };
    }
    logout() {
        axios.get("/logout");
    }
    handleChange(e) {
        this.setState({
            file: e.target.files[0]
        });
    }
    render() {
        return (
            <div id="uploader">
                {this.state.error && (
                    <h3 className="error">
                        <br /> {this.state.error} <br />
                        <br />
                    </h3>
                )}
                <a
                    href="#"
                    className="close"
                    onClick={this.props.closeModal}
                ></a>
                <h3>Would you like to upload a new profile picture?</h3>
                <br />
                <br />
                <form>
                    <br />
                    <br />
                    <div className="upload-btn-wrapper">
                        <input
                            onChange={e => this.handleChange(e)}
                            type="file"
                            name="file"
                            accept="image/*"
                        />
                        <button
                            onClick={this.props.submitUpload(this.state.file)}
                            type="submit"
                            className="upload-btn"
                        >
                            CHOOSE FILE
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
