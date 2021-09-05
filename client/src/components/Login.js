import React from 'react';
import Logo from './Logo';
import '../styles/Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signUp: false,
      email: '',
      password: ''
    }

    this.toggleSignUp = this.toggleSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.signUp = this.signUp.bind(this);
  }

  render() {
    return (
      <div style={{height: "100vh"}}>
        <nav className="navbar navbar-light bg-white" style={{height: "10vh"}}>
          <div className="container-fluid">
            <Logo />
            <button type="button" className="btn-close" aria-label="Close" onClick={this.props.hide}></button>
          </div>
        </nav>
        <div style={{height: "90vh"}}>
          <form >
            <h2 className="h2">
              <b>{(this.state.signUp) ? "Sign Up" : "Log In"}</b>
            </h2>
            <div className="mb-3">
              <div className="contianer-fluid d-flex justify-content-between">
                <label htmlFor="email" className="form-label align-self-center" >
                  Email address
                </label>
                <span className="align-self-center">
                  {(this.state.signUp) ? "Already have an account?" : "Need an account?"}
                  <a href="#" onClick={this.toggleSignUp}>
                    {(this.state.signUp) ? "Log In" : "Sign Up"}
                  </a>
                </span>
              </div>
              <input 
                type="email" 
                id="email"
                className="form-control" 
                aria-describedby="emailHelp" 
                placeholder="name@example.com" 
                onChange={this.handleChange}
                required
              />
              <div id="emailFeedback"></div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input 
                type="password"
                id="password" 
                className="form-control" 
                onChange={this.handleChange}
                required
              />
              <div id="passwordFeedback"></div>
            </div>
            <div id="generalFeedback" className="alert alert-danger" style={{display: "none", padding: "10px"}}></div>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={(this.state.signUp) ? this.signUp : this.logIn}>
                {(this.state.signUp) ? "Sign Up" : "Log In"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  toggleSignUp() {
    const currState = this.state.signUp;
    document.querySelector('#password').value = "";
    this.setState({
      password: "",
      signUp: !currState
    })
  }

  handleChange(ev) {
    this.setState({
      [ev.target.type]: ev.target.value
    })
  }

  feedbackEmail(message) {
    /**
     * Provide feedback to user about email entry
     * 
     * @param {String} message Feedback message on invalid input, or null on valid input
     */
    const input = document.querySelector('#email');
    const feedback = document.querySelector('#emailFeedback');

    if (message) {
      input.classList.add('is-invalid');
      feedback.classList.add('invalid-feedback');
      feedback.innerHTML=message;
    } else {
      input.classList.remove('is-invalid');
      feedback.classList.remove('invalid-feedback');
      feedback.innerHTML="";
    }

  }

  feedbackPassword(message) {
    /**
     * Provide feedback to user about password entry
     * 
     * @param {String} message Feedback message on invalid input, or null on valid input
     */
    const input = document.querySelector('#password');
    const feedback = document.querySelector('#passwordFeedback');

    if (message) {
      input.classList.add('is-invalid');
      feedback.classList.add('invalid-feedback');
      feedback.innerHTML=message;
    } else {
      input.classList.remove('is-invalid');
      feedback.classList.remove('invalid-feedback');
      feedback.innerHTML="";
    }

  }

  feedbackPost(message) {
    /**
     * Provide feedback to user after attempting to Log In or Sign Up
     * 
     * @param {String} message Feedback message on invalid input, or null on valid input
     */
    const feedback = document.querySelector('#generalFeedback');

    if (message) {
      document.querySelector('#password').value = "";
      feedback.style.display = "block";
      feedback.innerHTML = message;
    } else {
      feedback.style.display= "none";
      feedback.innerHTML = "";
    }

  }

  validateEmail(email) {
    /**
     * Validate current email address entry by user
     * 
     * @param {string} email current email address entry
     */
    if (email === "") {
      this.feedbackEmail("Please enter your email address");
      return false;
    }

    const regEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$")
    if (!regEmail.test(email)) {
      this.feedbackEmail("Email address must conform to format: name@example.com");
      return false;
    }

    this.feedbackEmail(null);
    return true;
  }

  validatePassword(password) {
    /**
     * Validate current password entry by user
     * 
     * @param {string} password current password entry
     */
    if (password === "") {
      this.feedbackPassword("Please enter your password");
      return false;
    }

    if (password.length > 20 || password.length < 8){
      this.feedbackPassword("Password must be 8-20 characters");
      return false;
    }

    this.feedbackPassword(null);
    return true;
  }

  authPost(endpoint) {
    /**
     * Make a POST request to obtain authorization tokens with current email and password
     * 
     * @param {string} endpoint - API endpoint to make POST request to
     */
    const email = this.state.email;
    const password = this.state.password;

    if (!this.validateEmail(email) || !this.validatePassword(password)) {
      return;
    }

    const reqBody = {
      'email': email,
      'password': password,
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${endpoint}`, 
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reqBody)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            this.feedbackPost(data.message);
            return;
          }

          this.feedbackPost(null);
          this.props.finish(data);

        })
        .catch(err => console.log(err));
  }

  logIn() {
    this.authPost('/account/login');
  }
  
  signUp() {
    this.authPost('/account');
  }

}

export default Login;