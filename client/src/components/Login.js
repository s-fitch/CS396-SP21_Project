import React from 'react';
import Logo from './Logo';
import '../styles/Login.css';

class Login extends React.Component {
  render () {
    return (
      <div style={{height: "100vh"}}>
        <nav className="navbar navbar-light bg-white" style={{height: "10vh"}}>
          <div className="container-fluid">
            <Logo />
            <button type="button" className="btn-close" aria-label="Close" onClick={this.props.hide}></button>
          </div>
        </nav>
        <div style={{height: "90vh"}}>
          <LoginForm 
            finish={this.props.finish}/>
          </div>
        </div>
      )
    }

}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.showLogIn = this.showLogIn.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.makePost = this.makePost.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.state = {
      email: '',
      password: '',

      currText: 'Log in',
      switchPrompt: 'Need an account?',
      switchText: 'Sign Up',
      handleSubmit: this.handleLogin,
      handleSwitch: this.showSignUp
    }    
  }

  render() {
    return (
      <form >
        <h2 className="h2"><b>{this.state.currText}</b></h2>
        <div className="mb-3">
          <div className="contianer-fluid d-flex justify-content-between">
            <label htmlFor="exampleInputEmail1" className="form-label align-self-center" >
              Email address
            </label>
            <span className="align-self-center">
              {this.state.switchPrompt}
              <a href="#" onClick={this.state.handleSwitch}>
                {this.state.switchText}
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
          <label htmlFor="exampleInputPassword1" className="form-label">
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
        <button type="button" className="btn btn-primary" onClick={this.state.handleSubmit}>
          {this.state.currText}
        </button>
      </form>
    )
  }

  handleChange (ev) {
    this.setState({
      [ev.target.type]: ev.target.value
    })
  }

  resetForm() {
    this.validEmail();
    this.validPassword();
    this.feedbackSuccess();
    document.querySelector('#email').value="";
    document.querySelector('#password').value="";
  }
  
  showLogIn () {
    this.resetForm();
    this.setState({
      email: '',
      password: '',

      currText: 'Log in',
      switchPrompt: 'Need an account?',
      switchText: 'Sign Up',
      handleSubmit: this.handleLogin,
      handleSwitch: this.showSignUp
    })
  }
  
  showSignUp () {
    this.resetForm();
    this.setState({
      email: '',
      password: '',

      currText: 'Sign Up',
      switchPrompt: 'Already have an account?',
      switchText: 'Log in',
      handleSubmit: this.handleSignUp,
      handleSwitch: this.showLogIn
    })
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

  feedbackFail(message) {
    document.querySelector('#password').value = "";
    const feedback = document.querySelector('#generalFeedback');
    feedback.style.display = "block";
    feedback.innerHTML = message;
    return;
  }
  
  feedbackSuccess() {
    const feedback = document.querySelector('#generalFeedback');
    feedback.style.display= "none";
    feedback.innerHTML = "";
    return;
  }

  handleLogin () {
    this.makePost('/account/login');
  }
  
  handleSignUp () {
    this.makePost('/account');
  }

  makePost(path) {
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
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}${path}`, 
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reqBody)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            // Failed authentication
            console.log(data);
            this.feedbackFail(data.message);
            return;
          }

          this.feedbackSuccess();
          this.props.finish(data);

        })
        .catch(err => console.log(err));
  }
  
}

export default Login;