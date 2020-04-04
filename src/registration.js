import React from "react";
import axios from "./axios.js";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            error: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitRegistration = this.submitRegistration.bind(this);
    }
    logout() {
        axios.get("/logout");
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
    submitRegistration(e) {
        e.preventDefault();
        console.log("button has been clicked");
        console.log("welcome state: ", this.state);
        if (!this.state.first) {
            this.setState({
                error: "Please enter your first name."
            });
            return;
        }
        if (!this.state.last) {
            this.setState({
                error: "Please enter your last name."
            });
            return;
        }
        if (!this.state.email) {
            this.setState({
                error: "Please enter a valid email address."
            });
            return;
        }
        if (!this.state.password) {
            this.setState({
                error: "Please do not leave the password field blank."
            });
            return;
        }
        let stuff = this.state;
        console.log("stuff: ", stuff);
        axios
            .post("/registration", stuff)
            .then(({ data }) => {
                if (data.success == true) {
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
                {this.state.error && (
                    <h3 className="error">
                        <br /> {this.state.error} <br />
                        <br />
                    </h3>
                )}
                <h3>Please register here:</h3>
                <form>
                    <input
                        onChange={this.handleChange}
                        name="first"
                        type="text"
                        placeholder="First name"
                    />
                    <br />
                    <input
                        onChange={this.handleChange}
                        name="last"
                        type="text"
                        placeholder="Last name"
                    />
                    <br />
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
                        placeholder="Your password"
                    />
                    <button onClick={this.submitRegistration} type="submit">
                        REGISTER
                    </button>
                </form>
                <br />
                <br />
                <p>
                    Already a member? <Link to="/login">Log in!</Link>
                </p>
            </div>
        );
    }
}
