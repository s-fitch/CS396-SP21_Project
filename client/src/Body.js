import React from 'react';
import './App.css';

import CommunityList from './CommunityList';
import CommunityView from './CommunityView';

class Body extends React.Component {
  render () {
    let content;
    if (this.props.tokens) {
        // Logged in
        content = (
            <div className="row" style={{flexWrap:"nowrap", height: "100%"}}>
                <div className="col" style={{minWidth: "200px", padding: "0px", maxWidth:"200px"}}>
                    <CommunityList 
                        tokens={this.props.tokens}
                        selectCommunity={this.props.selectCommunity}/>
                </div>
                <div className="col" style={{maxHeight: "100%", overflow: 'hidden'}}>
                    <CommunityView 
                        community={this.props.community}/>
                </div>
            </div>
        )
    } else {
        content = (
            <div className="row" style={{flexWrap:"nowrap", height: "100%"}}>
                <div>
                    Log in
                </div>
            </div>
        )
    }

    return (
        <div className="container-fluid bg-success" style={{height: "90vh"}}>
            {content}
        </div>
    )
  }
}

export default Body;