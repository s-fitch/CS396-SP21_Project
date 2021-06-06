import React from 'react';
import './App.css';

class Avatar extends React.Component {
  render () {
    return (
        <div className="d-flex">
            <button className="btn btn-outline-primary" type="button">Sign Up</button>
            <button className="btn btn-outline-primary" type="button" style={{marginLeft: '10px'}}>Log In</button>
        </div>
    )
  }
}

export default Avatar;