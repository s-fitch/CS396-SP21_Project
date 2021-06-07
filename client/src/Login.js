import React from 'react';
import HeaderLogo from './HeaderLogo';
import './Login.css';

const baseURL = 'http://localhost:3000';

class Login extends React.Component {
    render () {
        return (
            <div style={{height: "100vh"}}>
                <nav className="navbar navbar-light bg-white" style={{height: "10vh"}}>
                    <div className="container-fluid">
                        <HeaderLogo />
                        <button type="button" className="btn-close" aria-label="Close" onClick={this.props.hide}></button>
                    </div>
                </nav>
                <div style={{height: "90vh"}}>
                    <LoginForm />
                </div>
            </div>
        )
    }
}

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'email': "",
            'password': "",
            'handleSubmit': this.handleLogin
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        //this.handleSignup = this.handleSignup.bind(this);
    }

    render() {
        return (
            <form >
                <h2 className="h2"><b>Log in</b></h2>
                <div className="mb-3">
                    <div className="contianer-fluid d-flex justify-content-between">
                        <label htmlFor="exampleInputEmail1" className="form-label align-self-center" >Email address</label>
                        <span className="align-self-center">
                            Need an account?
                            <a href="#">Sign Up</a>
                        </span>
                    </div>
                    <input type="email" 
                        id="email"
                        className="form-control" 
                        aria-describedby="emailHelp" 
                        placeholder="name@example.com" 
                        onChange={this.handleChange}
                        required/>
                    <div id="emailFeedback"></div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password"
                        id="password" 
                        className="form-control" 
                        onChange={this.handleChange}
                        required/>
                    <div id="passwordFeedback"></div>
                </div>
                <div id="generalFeedback" className="alert alert-danger" style={{display: "none", padding: "10px"}}></div>
                <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Log in</button>
            </form>
        )
    }

    handleChange (ev) {
        this.setState({
            [ev.target.type]: ev.target.value
        })
        console.log(ev.target.value);
    }

    invalidEmail(message) {
        const input = document.querySelector('#email');
        input.classList.add('is-invalid');
        const feedback = document.querySelector('#emailFeedback');
        feedback.classList.add('invalid-feedback');
        feedback.innerHTML=message;
    }
    validEmail() {
        const input = document.querySelector('#email');
        input.classList.remove('is-invalid');
        const feedback = document.querySelector('#emailFeedback');
        feedback.classList.remove('invalid-feedback');
        feedback.innerHTML="";
    }
    validateEmail () {
        const email = this.state.email;

        if (email === "") {
            this.invalidEmail("Please enter your email address");
            return false;
        }

        const regEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$")
        if (!regEmail.test(email)) {
            console.log('ugh')
            this.invalidEmail("Email address must conform to format: name@example.com");
            return false;
        }

        this.validEmail();
        return true;
    }

    invalidPassword(message) {
        const input = document.querySelector('#password');
        input.classList.add('is-invalid');
        const feedback = document.querySelector('#passwordFeedback');
        feedback.classList.add('invalid-feedback');
        feedback.innerHTML=message;
    }
    validPassword() {
        const input = document.querySelector('#password');
        input.classList.remove('is-invalid');
        const feedback = document.querySelector('#passwordFeedback');
        feedback.classList.remove('invalid-feedback');
        feedback.innerHTML="";
    }
    validatePassword() {
        const password = this.state.password;

        if (password === "") {
            this.invalidPassword("Please enter your password");
            return false;
        }

        if (password.length > 20 || password.length < 8){
            this.invalidPassword("Password must be 8-20 characters");
            return false;
        }

        this.validPassword();
        return true;
    }

    failedLogin(message) {
        document.querySelector('#password').value = "";
        const feedback = document.querySelector('#generalFeedback');
        feedback.style.display = "block";
        feedback.innerHTML = message;
        return;
    }
    successLogin() {
        const feedback = document.querySelector('#generalFeedback');
        feedback.style.display= "none";
        feedback.innerHTML = "";
        return;
    }

    handleLogin (ev) {
        const validEmail = this.validateEmail();
        const validPassword = this.validatePassword();
        if (!(validEmail && validPassword)) {
            return;
        }

        const reqBody = {
            'email': this.state.email,
            'password': this.state.password
        }

        // Make Login attempt
        fetch(`/account/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                // Failed authentication
                console.log(data);
                this.failedLogin(data.message);
                return;
            }

            this.props.finished(data);

        })
        .catch(err => console.log(err));
    }
}

export default Login;