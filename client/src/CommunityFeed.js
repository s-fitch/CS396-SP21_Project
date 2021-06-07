import React from 'react';

class CommunityFeed extends React.Component {
    render() {
        let communityHeader = null;
        if (this.props.communityInfo) {
            communityHeader = (
                <div className='container-fluid'>
                    <h3><b>{this.props.communityInfo.name}</b></h3>
                    <p><small>{this.props.communityInfo.description}</small></p>
                </div>
            )
        }

        let feedList = this.props.feed.map(q => (
            <a 
                href="#"
                className="list-group-item list-group-item-action"
                onClick={this.props.selectQuestion}
                key={q._id}
                id={q._id}
                style={{height: "100px"}}>
                    <h6><b>{q.title}</b></h6>
                    <div className='text-truncate'>
                        {q.content}
                    </div>
            </a>
        ))

        return (
        <div className="col" style={{height: "100%", overflowY: "auto"}}>
            {communityHeader}
            <ul className="list-group">
                {feedList}
            </ul>
        </div>
        )
    }
}

export default CommunityFeed;