import * as React from 'react';

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: ''
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  render() {
    return (
      <form className="container-fluid card">
        <div className="mb-3">
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Write your answer..."
            onChange={this.handleChange}
          >
          </textarea>
        </div>
        <div style={{marginLeft: "auto"}}>
          <button
            type="button"
            className="btn btn-outline-secondary ml-auto"
            style={{width: "100px"}}
            onClick={this.props.close}
          >
            Cancel
          </button>
          <button 
            type="button"
            className="btn btn-primary ml-2"
            style={{width: "100px", marginLeft: "5px"}}
            onClick={this.submit}
          >
            Submit
          </button>
        </div>
      </form>
    );
  }

  handleChange(ev) {
    this.setState({
      text: ev.target.value
    })
  }

  submit() {
    if (this.state.text === "") {
      return;
    }

    const answer = {
      'content': this.state.text
    }
          
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/q/${this.props.question}/a`, 
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${this.props.tokens.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answer)
      })
        .then(response => {
          if (response.status === 204) {
            this.props.finished();
          } else {
            console.log('Request failed with code ' + response.status);
          }
        })
        .catch(err => console.log(err))
  }
}

export default QuestionForm;