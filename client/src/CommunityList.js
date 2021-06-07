import React from 'react';

class CommunityList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            communities: []
        }
    }

    render () {

        const communityList = this.state.communities.map(comm => (
            <a 
                href="#" 
                className="list-group-item list-group-item-action" 
                key={comm._id}
                id={comm._id}
                onClick={this.props.selectCommunity}>
                    {comm.name}
            </a>
        ))

        return (
            <ul className="list-group" style={{height: '100%', overflowY: "auto"}}>
                {communityList}
            </ul>
        )
    }

    componentDidMount () {
        if (this.props.tokens) {
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
    }
}

export default CommunityList;