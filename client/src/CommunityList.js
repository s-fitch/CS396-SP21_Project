import React from 'react';

class CommunityList extends React.Component {
  render () {
    const comms = Array.from(Array(100).keys()).map(i => <a className="row" key={i}>Community {i}</a>);
    return (
        <div className="container-fluid bg-white" style={{height: '100%', overflowY: "auto"}}>
            {comms}
        </div>
    )
  }
}

export default CommunityList;