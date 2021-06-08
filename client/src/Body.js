import React from 'react';
import './App.css';

import CommunityList from './CommunityList';
import CommunityView from './CommunityView';
import CommunitySearch from './CommunitySearch';

class Body extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            communities: [],
            community: null,
            question: null
        }

        this.selectCommunity = this.selectCommunity.bind(this);
        this.updateCommunities = this.updateCommunities.bind(this);
    }

    render () {
        let content;
        if (this.props.tokens) {
            // Logged in
            content = (
                <div className="row" style={{flexWrap:"nowrap", height: "100%"}}>
                    <div className="col bg-light" style={{minHeight: "100%", maxHeight: "100%", minWidth: "200px", padding: "0px", maxWidth:"200px"}}>
                        <CommunityList 
                            tokens={this.props.tokens}
                            selectCommunity={this.selectCommunity}
                            communities={this.state.communities}
                            updateCommunities={this.updateCommunities}/>
                    </div>
                    <div className="col" style={{minHeight: "100%", maxHeight: "100%", overflow: 'hidden'}}>
                        <CommunityView 
                            tokens={this.props.tokens}
                            community={this.state.community}
                            communities={this.state.communities}
                            updateCommunities={this.updateCommunities}/>
                    </div>
                </div>
            )
        } else {
            // Not logged in
            content = (
                <div className="row" style={{flexWrap:"nowrap", height: "100%"}}>
                    <CommunitySearch />
                </div>
            )
        }

        return (
            <div className="container-fluid" style={{height: "90vh"}}>
                {content}
            </div>
        )
    }

    updateCommunities() {
        fetch('/account/feed', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.props.tokens.access_token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data.message);
                return;
            } else {
                this.setState({
                    communities: data
                })
            }
        })
    }

    selectCommunity (ev) {
        this.setState({
            community: ev.target.id
        });
    }

}

export default Body;