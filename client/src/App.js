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
         *      1: Log In
         *      2: Sign Up
         *  prevView - Previous view state (for knowing where back returns to?)
         *      0: Base App
         *      1: Log In
         *      2: Sign Up
         */

        this.state = {
            currView: 0,
            prevView: 0
        }

        this.showLogin = this.showLogin.bind(this);
        this.hideLogin = this.hideLogin.bind(this);
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

    saveTokens (tokens) {
        document.cookie = `access_token=${tokens.access_token}`
        document.cookie = `refresh_token=${tokens.refresh_token}`;
    }

    render () {
        switch (this.state.currView) {
            case 0:
                return (
                <div style={{height: '100vh'}}>
                    <Header 
                        showLogin = {this.showLogin}/>
                    <Body />
                </div>
                );
            case 1:
                return (
                <Login 
                    hide={this.hideLogin}/>
                )
            default:
                return (
                <div>
                    What did you do??
                </div>
                )
        }
  }
}

export default App;
