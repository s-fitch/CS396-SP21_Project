import * as React from 'react';

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionTitle: '',
      questionContent: ''
    }
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <form className="container-fluid card">
        <div className="mb-3">
          <input
            type="text"
            id="questionTitle"
            className="form-control"
            maxLength={35}
            placeholder="Brief question title..."
            onChange={this.handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <textarea 
            className="form-control" 
            rows="3" 
            placeholder="Full question..."
            id="questionContent"
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
    )
  }

  handleChange(ev) {
    this.setState({
      [ev.target.id]: ev.target.value
    })
  }
  
  submit() {
    if (this.state.questionTitle === "" || this.state.questionContent === "") {
      return;
    }

    if (!this.props.communityInfo) {
      return;
    }

    // Compose post for question
    const question = {
      'title': this.state.questionTitle,
      'content': this.state.questionContent
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.communityInfo._id}/q`, 
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.props.tokens.access_token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(question),
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            return
          }
          this.setState({
            questionTitle: '',
            questionContent: ''
          })
          this.props.finished();
        })
        .catch(err => console.log(err));
  }
  
}

export default QuestionForm;