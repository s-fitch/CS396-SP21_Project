import React from 'react';

class Account extends React.Component {

    render () {
        return (
        <div className="d-flex">
            <button className="btn btn-primary" type="button" onClick={this.props.showLogin}>Log In</button>
        </div>
        );
    }
}

export default Account;