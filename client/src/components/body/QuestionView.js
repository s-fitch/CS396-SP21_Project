import * as React from 'react';
import AnswerForm from './AnswerForm';

class QuestionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questionInfo: {},
      answers: [],
      showAnswerInput: false
    }
    this.openAnswer = this.openAnswer.bind(this);
    this.closeAnswer = this.closeAnswer.bind(this);
  }

  render() {
    let answers = null;
    if (this.state.answers) {
      answers = this.state.answers.map(a => (
        <li 
          key={a._id}
          className="list-group-item"
          id={a._id}>
          {a.content}
        </li>
      ))
    }

    return (
      <div style={{height: "100%", overflowY: "auto"}}>
        <nav className="navbar navbar-light bg-white" style={{height: "5vh", marginBottom: "20px"}}>
          <div className="container-fluid">
            <h5>Question</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={this.props.close}></button>
          </div>
        </nav>
        
        <div className="container-fluid">
          <h6>{this.state.questionInfo.title}</h6>
          <p>{this.state.questionInfo.content}</p>
        </div>

        <div className="container-fluid d-flex justify-content-between align-items-center" style={{marginTop: "30px"}}>
          <span className="h5">Answers</span>
          {this.genAnswerButton()}
        </div>

        {this.state.showAnswerInput && (
          <AnswerForm 
            tokens={this.props.tokens}
            close={this.closeAnswer}
            finished={this.closeAnswer}
          />
        )}

        <ul className="list-group mb-5">
          {answers}
        </ul>
      </div>
    )
  }

  updateInfo () {
    let header = {}
    if (this.props.tokens) {
      header.Authorization = `Bearer ${this.props.tokens.access_token}`
    }

    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/q/${this.props.question}`, 
      {
        method: "GET",
        headers: header
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            return;
          }

          this.setState({
            questionInfo: data,
            answers: data.answers
          });
        });
  }

  componentDidMount() {
    this.updateInfo()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.question !== this.props.question) {
      this.updateInfo()
    }
  }

  openAnswer() {
    this.setState({
      showAnswerInput: true
    })
  }
  
  closeAnswer() {
    this.setState({
      showAnswerInput: false
    })
  }

  finishedAnswerInput() {
    this.closeAnswer();
    this.updateInfo();
  }
  
  genAnswerButton() {
    if (!this.props.tokens){
      return null
    } else if (this.state.showAnswerInput) {
      return null;
    } else {
      return (
        <button 
          type="button" 
          className="btn btn-primary " 
          style={{margin: "5px"}}
          onClick={this.openAnswer}
        >
          Answer
        </button>
      )
    }
  }


}

export default QuestionView;