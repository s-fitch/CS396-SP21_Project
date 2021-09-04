import * as React from 'react';

class CommunityJoin extends React.Component {
  constructor (props) {
    super(props);

    this.joinCommunity = this.joinCommunity.bind(this);
    this.leaveCommunity = this.leaveCommunity.bind(this);
    this.handleJoinLeave = this.handleJoinLeave.bind(this);
  }

  render () {
    if (!this.props.tokens) {
      return null;
    }

    let classes="";
    let text="";
    let submit=null;

    if (this.props.joined) {
      classes="btn btn-outline-secondary";
      text="Leave";
      submit=this.leaveCommunity;
    } else {
      classes="btn btn-outline-primary";
      text="Join";
      submit=this.joinCommunity;
    }

    return (
      <button 
        type="button"
        className={classes}
        style={{borderRadius: "30px", padding: "0px", width: "70px", marginLeft: '30px'}}
        onClick={submit}
      >
        {text}
      </button>
    )
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