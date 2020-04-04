import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentDisplay: 1
        };
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.sendPasswordReset = this.sendPasswordReset.bind(this);
    }
    handleChange(e) {
        e.preventDefault();
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // () => console.log("this.state: ", this.state)
        );
    }
    sendPasswordReset(e) {
        e.preventDefault();
        // console.log("button has been clicked");
        // console.log("welcome state: ", this.state);
        if (!this.state.email) {
            this.setState({
                error:
                    "Please enter the email address you submitted previously."
            });
            return;
        }
        let stuff = this.state;
        axios
            .post("/reset-password", stuff)
            .then(response => {
                if (response.data.success == true) {
                    this.setState({
                        currentDisplay: 2
                    });
                }
            })
            .catch(err => {
                console.log("err", err);
                this.setState({
                    error: "Oops, something went wrong..."
                });
            });
    }
    submit(e) {
        e.preventDefault();
        console.log("hi");
        // console.log("this.state in submit function: ", this.state);
        let stuff = this.state;
        axios
            .post("/reset-password/code", stuff)
            .then(response => {
                console.log("response: ", response);
                if (response.data.success == true) {
                    this.setState({
                        currentDisplay: 3
                    });
                    console.log("this.state: ", this.state);
                }
            })
            .catch(err => {
                console.log("err: ", err);
            });
    }
    // componentDidMount() {}
    render() {
        return (
            <div>
                {this.state.error && (
                    <h3 className="error">
                        <br /> {this.state.error} <br />
                        <br />
                    </h3>
                )}
                {this.state.currentDisplay == 1 && (
                    <div>
                        <h2>
                            Please enter the email address you submitted upon
                            registration:
                        </h2>
                        <form>
                            <br />
                            <input
                                onChange={this.handleChange}
                                name="email"
                                type="text"
                                placeholder="Your email address"
                            />
                            <br />
                            <button
                                onClick={this.sendPasswordReset}
                                type="button"
                                name="button"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 2 && (
                    <div>
                        <h2>
                            Please enter the code you received and choose a new
                            password:
                        </h2>
                        <form method="post">
                            <input
                                onChange={this.handleChange}
                                type="text"
                                name="code"
                                placeholder="Code"
                            />
                            <input
                                onChange={this.handleChange}
                                type="password"
                                name="password"
                                placeholder="Your new password"
                            />
                            <button
                                onClick={this.submit}
                                type="submit"
                                name="button"
                            >
                                SUBMIT
                            </button>
                        </form>
                    </div>
                )}
                {this.state.currentDisplay == 3 && (
                    <div>
                        <br />
                        <h2 id="reset-success">
                            The password was changed successfully. You may
                            proceed to the <Link to="/login">login page</Link>
                            once more!
                        </h2>
                        <br />
                    </div>
                )}
            </div>
        );
    }
}
