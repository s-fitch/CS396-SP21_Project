import React from 'react';
import './App.css';

import Account from './Account';
import HeaderLogo from './HeaderLogo';

class Header extends React.Component {
  render () {
    return (
        <nav className="navbar navbar-light bg-light" style={{height: "10vh"}}>
            <div className="container-fluid">
                <HeaderLogo />
                <Account 
                    showLogin={this.props.showLogin}/>
            </div>
        </nav>
    )
  }
}

export default Header;
