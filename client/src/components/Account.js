import React from 'react';

class Account extends React.Component {

    render () {
        let buttonFunc;
        let buttonText;

        if (this.props.tokens) {
            buttonFunc = this.props.logout;
            buttonText = 'Logout';
        } else {
            buttonFunc = this.props.showLogin;
            buttonText = 'Log In';
        }
        return (
        <div className="d-flex">
            <button className="btn btn-primary" type="button" onClick={buttonFunc}>{buttonText}</button>
        </div>
        );
    }
}

export default Account;