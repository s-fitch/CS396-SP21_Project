import React from 'react';
import Logo from '../Logo';

const Header = ({ showHome, tokens, logout, showLogin }) => {
  return (
    <nav className="navbar navbar-light bg-light" style={{height: "10vh"}}>
      <div className="container-fluid">
        <a 
          href="#" 
          style={{textDecoration: 'none'}}
          onClick={showHome}
        >
          <Logo />
        </a>

        {(tokens) ? (
          <div className="d-flex">
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="d-flex">
            <button 
              className="btn btn-primary" 
              type="button" 
              onClick={showLogin}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Header;
