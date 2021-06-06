import React from 'react';
import './App.css';

import CommunityList from './CommunityList';

class Body extends React.Component {
  render () {
    return (
      <div className="container-fluid bg-success" style={{height: "90vh"}}>
          <div class="row" style={{flexWrap:"nowrap", height: "100%"}}>
              <div class="col" style={{minWidth: "200px", padding: "0px", maxWidth:"200px"}}>
                  <CommunityList />
              </div>
              <div class="col">
                  Col2
              </div>
          </div>
      </div>
    )
  }
}

export default Body;