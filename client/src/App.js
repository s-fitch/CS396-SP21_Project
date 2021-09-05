import React from 'react';
import Header from './components/Header';
import Main from './components/Main';
import Login from './components/Login';

class App extends React.Component {
	constructor(props) {
		super(props);

		let tokens = this.getTokensFromCookie();
		tokens = (Boolean(tokens.access_token)&&Boolean(tokens.refresh_token)) ? tokens : null;

		this.state = {
			login: false,
			tokens: tokens,
			community: null
		}

		this.getCookie = this.getCookie.bind(this);
		this.setCookie = this.setCookie.bind(this);
		this.clearCookie = this.clearCookie.bind(this);

		this.getTokensFromCookie = this.getTokensFromCookie.bind(this);
		this.setTokensInCookie = this.setTokensInCookie.bind(this);
		this.clearTokensFromCookie = this.clearTokensFromCookie.bind(this);

		this.showLogin = this.showLogin.bind(this);
		this.hideLogin = this.hideLogin.bind(this);
		this.finishLogin = this.finishLogin.bind(this);
		this.logout = this.logout.bind(this);
		
		this.selectCommunity = this.selectCommunity.bind(this);
		this.showLanding = this.showLanding.bind(this);
	}

	render() {
		return (
			(this.state.login) ? (
				<Login 
					hide={this.hideLogin}
					finish={this.finishLogin}
				/>
			) : (
				<div style={{height: '100vh'}}>
					<Header 
						tokens={this.state.tokens}
						logout={this.logout}
						showLogin={this.showLogin}
						showHome={this.showLanding}
					/>
					<Main 
						tokens = {this.state.tokens}
						community = {this.state.community}
						selectCommunity = {this.selectCommunity}
					/>
				</div>
			)
		);
	}

	getCookie (key) {
		/**
		 * Retrieve specified cookie
		 * 
		 * @param {String} key identifier for desired cookie
		 */
		const cookie = document.cookie.split('; ').find(elem => elem.startsWith(`${key}=`))
		return (cookie) ? cookie.split('=')[1] : null;
	}
	
	setCookie (key, value) {
		/**
		 * Set value for specified cookie
		 * 
		 * @param {String} key identifier for desired cookie
		 * @param {String} value value to store in cookie
		 */
		document.cookie = `${key}=${value}`;
		return;
	}
  
	clearCookie (key) {
		/**
		 * Clear specified cookie
		 * 
		 * @param {String} key identifier for desired cookie
		 */
		document.cookie = `${key}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`
		return;
	}

	getTokensFromCookie () {
		/**
		 * Retreive application JSON Web Tokens (JWT) from cookie
		 */
		return {
			access_token: this.getCookie('access_token'),
			refresh_token: this.getCookie('refresh_token')
		}
	}
  
	setTokensInCookie(tokens) {
		/**
		 * Store application JSON Web Tokens (JWT) in cookie
		 * 
		 * @param {Object} tokens JWT to store
		 */
		this.setCookie('access_token', tokens.access_token);
		this.setCookie('refresh_token', tokens.refresh_token);
		return;
	}
  
	clearTokensFromCookie () {
		/**
		 * Clear application JSON Web Tokens (JWT) from cookie
		 */
		this.clearCookie('access_token');
		this.clearCookie('refresh_token');
	}

	showLogin() {
		/**
		 * Show account login page
		 */
		this.setState({
			login: true
		})
	}

	hideLogin () {
		/**
		 * Hide account login page
		 */
		this.setState({
			login: false
		})
	}
  
	finishLogin(tokens) {
		/**
		 * Finish login process 
		 */
		this.setTokensInCookie(tokens);
		this.setState({
			login: false,
			tokens: tokens,
			community: null
		})
	}
	
	logout () {
		/**
		 * Log user out of application
		 */
		if (window.confirm("Are you sure you want to logout?")) {
			this.clearTokensFromCookie();
			this.setState({
				tokens: null,
				community: null
			})
		}
	}
    
	selectCommunity (ev) {
		/**
		 * Select community to display
		 */
		this.setState({
			community: ev.target.id
		});
	}
  
	showLanding () {
		/**
		 * Show application landing page
		 */
		this.setState({
			community: null
		})
	}

}

export default App;
