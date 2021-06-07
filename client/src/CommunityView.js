import React from 'react';

class CommunityView extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            communityInfo: null,
            feed: []
        }
    }
    render () {
        if (!this.props.community) {
            return null;
        } 

        let communityHeader = null;
        if (this.state.communityInfo) {
            communityHeader = (
                <div className='container-fluid bg-info'>
                    <h3>{this.state.communityInfo.name}</h3>
                    <p><small>{this.state.communityInfo.description}</small></p>
                </div>
            )
        }

        let feedList = this.state.feed.map(q => (
            <li 
                className="list-group-item bg-warning" 
                key={q._id} 
                id={q._id}>
                    {q.title}
            </li>
        ))

        return (
        <div className="col" style={{height: "100%"}}>
            {communityHeader}
            <ul className="list-group list-group-flush">
                {feedList}
            </ul>
        </div>
        )
    }

    componentDidMount () {
        
        if (this.props.community) {
            this.updateInfo();
            this.updateFeed();
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.community !== this.props.community) {
            this.updateInfo();
            this.updateFeed();
        }

    }

    

    updateInfo() {
        // Get community info
        fetch(`/c/${this.props.community}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data);
                return;
            }

            this.setState({
                communityInfo: data
            })
        })
    }
    updateFeed() {
        // Get community feed
        fetch(`/c/${this.props.community}/feed`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                console.log(data);
                return;
            }

            this.setState({
                feed: data.questions
            })
        })
        .catch(err => console.log(err))
    }
}

export default CommunityView;