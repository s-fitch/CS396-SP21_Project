import React from 'react';

class CommunityFeed extends React.Component {
    render() {
        let communityHeader = null;
        if (this.props.communityInfo) {
            communityHeader = (
                <div className='container-fluid bg-info'>
                    <h3>{this.props.communityInfo.name}</h3>
                    <p><small>{this.props.communityInfo.description}</small></p>
                </div>
            )
        }

        let feedList = this.props.feed.map(q => (
            <a 
                href="#"
                className="list-group-item list-group-item-action"
                onClick={this.props.selectQuestion}>
                    {q.title}
                    <div className='text-truncate'>
                        {q.content}
                    </div>
            </a>
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
}

export default CommunityFeed;