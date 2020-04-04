import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
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
    submitLogin(e) {
        e.preventDefault();
        // console.log("button has been clicked");
        // console.log("login state: ", this.state);
        if (this.state.email == "") {
            this.setState({
                error: "Please enter your email address."
            });
            return;
        }
        if (this.state.password == "") {
            this.setState({
                error: "Please enter your password."
            });
            return;
        }
        let stuff = this.state;
        axios
            .post("/login", stuff)
            .then(response => {
                // console.log("response.data", response.data);
                if (response.data.success == true) {
                    return location.replace("/");
                } else {
                    this.setState({
                        error: "Please try again."
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
    render() {
        return (
            <div>
                <br />
                <br />
                <br />
                <br />
                {this.state.error && (
                    <h3 className="error">
                        <br />
                        {this.state.error}
                        <br />
                        <br />
                    </h3>
                )}
                <h2>Please provide the following information to log in:</h2>
                <form>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="Your email address"
                    />
                    <br />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                    />
                    <button
                        onClick={this.submitLogin}
                        type="button"
                        name="button"
                    >
                        LOGIN
                    </button>
                </form>

                <p>
                    Not a member yet? <a href="/welcome">Register now.</a>
                </p>
                <p>
                    Happen to forget your password?
                    <Link to="/reset-password">Reset it here!</Link>
                </p>
            </div>
        );
    }
}
