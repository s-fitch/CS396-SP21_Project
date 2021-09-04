import React from 'react';
import './App.css';

import Header from './Header';
import Body from './Body';
import Login from './Login';


class App extends React.Component {
    constructor(props) {
        super(props);

        /**
         * State Parameters
         *  currView - Current view state
         *      0: Base App
         *      1: Log In/Sign Up
         *  prevView - Previous view state (for knowing where back returns to?)
         *      0: Base App
         *      1: Log In/Sign Up
         */
        let tokens = this.getTokensFromCookie();
        tokens = (Boolean(tokens.access_token)&&Boolean(tokens.refresh_token)) ? tokens : null;

        this.state = {
            currView: 0,
            prevView: 0,
            tokens: tokens,
            community: null
        }

        this.showLogin = this.showLogin.bind(this);
        this.hideLogin = this.hideLogin.bind(this);
        this.finishLogin = this.finishLogin.bind(this);
        this.logout = this.logout.bind(this);

        this.getCookie = this.getCookie.bind(this);
        this.setCookie = this.setCookie.bind(this);
        this.clearCookie = this.clearCookie.bind(this);

        this.getTokensFromCookie = this.getTokensFromCookie.bind(this);
        this.setTokensInCookie = this.setTokensInCookie.bind(this);
        this.clearTokensFromCookie = this.clearTokensFromCookie.bind(this);
        
        this.selectCommunity = this.selectCommunity.bind(this);
        this.showLandingPage = this.showLandingPage.bind(this);
    }

    render () {
        switch (this.state.currView) {
            case 0:
                return (
                <div style={{height: '100vh'}}>
                    <Header 
                        tokens = {this.state.tokens}
                        logout = {this.logout}
                        showLogin = {this.showLogin}
                        showHome = {this.showLandingPage}/>
                    <Body 
                        tokens = {this.state.tokens}
                        community = {this.state.community}
                        selectCommunity = {this.selectCommunity}/>
                </div>
                );
            case 1:
                return (
                <Login 
                    hide={this.hideLogin}
                    finish={this.finishLogin}/>
                )
            default:
                return (
                <div>
                    What did you do??
                </div>
                )
        }
    }


    getCookie (key) {
        const cookie = document.cookie.split('; ').find(elem => elem.startsWith(`${key}=`))
        return (cookie) ? cookie.split('=')[1] : null;
    }
    setCookie (key, value) {
        document.cookie = `${key}=${value}`;
        return;
    }
    clearCookie (key) {
        document.cookie = `${key}= ; expires = Thu, 01 Jan 1970 00:00:00 GMT`
        return;
    }

    getTokensFromCookie () {
        return {
            access_token: this.getCookie('access_token'),
            refresh_token: this.getCookie('refresh_token')
        }
    }
    setTokensInCookie(tokens) {
        this.setCookie('access_token', tokens.access_token);
        this.setCookie('refresh_token', tokens.refresh_token);
        return;
    }
    clearTokensFromCookie () {
        this.clearCookie('access_token');
        this.clearCookie('refresh_token');
    }


    showLogin () {
        this.setState({
            prevView: this.state.currView,
            currView: 1
        })
    }
    hideLogin () {
        this.setState({
            currView: this.state.prevView
        })
    }
    finishLogin(tokens) {
        this.setTokensInCookie(tokens);
        this.setState({
            currView: 0,
            prevView: 0,
            tokens: tokens,
            community: null
        })
    }
    logout () {
        this.clearTokensFromCookie();
        this.setState({
            loggedIn: false,
            tokens: null,
            community: null
        })
    }
    
    selectCommunity (ev) {
        this.setState({
            community: ev.target.id
        });
    }
    showLandingPage () {
        this.setState({
            community: null
        })
    }
}

export default App;
