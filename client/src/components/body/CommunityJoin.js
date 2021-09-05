import * as React from 'react';

class CommunityJoin extends React.Component {
  constructor (props) {
    super(props);

    this.joinCommunity = this.joinCommunity.bind(this);
    this.leaveCommunity = this.leaveCommunity.bind(this);
    this.handleJoinLeave = this.handleJoinLeave.bind(this);
  }

  render() {
    const style = {
      borderRadius: "30px", 
      padding: "0px", 
      width: "70px", 
      marginLeft: '30px',
    }

    return (this.props.tokens && (
      (this.props.joined) ? (
        <button 
          type="button"
          className="btn btn-outline-secondary"
          style={style}
          onClick={this.leaveCommunity}
        >
          Leave
        </button>
      ) : (
        <button 
          type="button"
          className="btn btn-outline-primary"
          style={style}
          onClick={this.joinCommunity}
        >
          Join
        </button>
      )
    ));
  }

  handleJoinLeave(method) {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/join`, 
      {
        method: method,
        headers: {Authorization: `Bearer ${this.props.tokens.access_token}`}
      })
        .then(response => {
          if (response.status !== 204) {
            console.log(response);
            return;
          }
          this.props.finished();
        });
  }
    
  joinCommunity() {
    this.handleJoinLeave('POST');
  }
  
  leaveCommunity() {
    this.handleJoinLeave('DELETE');
  }

}

export default CommunityJoin;