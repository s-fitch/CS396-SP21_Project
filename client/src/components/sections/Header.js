import React from 'react';

import Account from '../Account';
import Logo from '../logo';

class Header extends React.Component {
  render () {
    return (
      <nav className="navbar navbar-light bg-light" style={{height: "10vh"}}>
        <div className="container-fluid">
          <a 
            href="#" 
            style={{textDecoration: 'none'}}
            onClick={this.props.showHome}
          >
            <Logo />
          </a>
          <Account 
            tokens={this.props.tokens}
            logout={this.props.logout}
            showLogin={this.props.showLogin}/>
          </div>
      </nav>
    )
  }
}

export default Header;
