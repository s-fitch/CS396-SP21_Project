import React from 'react';
import CommunityFeed from './CommunityFeed';

class CommunityView extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            communityInfo: null,
            feed: [],
            question: null,

        }
        this.selectQuestion = this.selectQuestion.bind(this);
    }


    render () {
        if (!this.props.community) {
            return null;
        } 

        if (true) {
            return (
                <CommunityFeed
                    communityInfo={this.state.communityInfo}
                    feed={this.state.feed}
                    selectQuestion={this.selectQuestion}
                    />
            )
        }
        
        
    }

    componentDidMount () {
        if (this.props.community) {
            this.updateInfo();
            this.updateFeed();
        }
    }

    componentDidUpdate (prevProps) {
        if (this.props.community && prevProps.community !== this.props.community) {
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

    selectQuestion (ev) {
        console.log(`Selected ${ev.target.id}`)
        this.setState({
            question: ev.target.id
        })
    }
}

export default CommunityView;