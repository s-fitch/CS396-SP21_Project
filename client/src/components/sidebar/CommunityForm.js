import * as React from 'react';

class CommunityForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      communityTitle: '',
      communityContent: ''
    }

    this.handleChange = this.handleChange.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  render() {
    return (
      <form className="container-fluid card" style={{width: "100%"}}>
        <div className="mb-3">
          <input
            type="text"
            id="communityTitle"
            className="form-control"
            maxLength={35}
            placeholder="Community name..."
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Description..."
            id="communityContent"
            onChange={this.handleChange}
          />
        </div>
        <button 
          type="button"
          className="btn btn-primary mb-1"
          style={{width: "100%"}}
          onClick={this.submitAnswer}
        >
          Submit
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          style={{width: "100%"}}
          onClick={this.props.close}
        >
          Cancel
        </button>
      </form>
    );
  }

  handleChange(ev) {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }

  submitAnswer() {
    if (this.state.communityTitle === "" || this.state.communityContent === "") {
      return;
    }

    const community = {
      name: this.state.communityTitle,
      description: this.state.communityContent
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.props.tokens.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(community)
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            return;
          }
          
          this.props.finished();
        });
  }

}

export default CommunityForm;