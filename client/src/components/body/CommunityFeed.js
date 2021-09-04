import React from 'react';
import CommunityJoin from './CommunityJoin';
import QuestionForm from './QuestionForm';

class CommunityFeed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showQuestionInput: false
    }

    this.showQuestionInput = this.showQuestionInput.bind(this);
    this.hideQuestionInput = this.hideQuestionInput.bind(this);
    this.finishedQuestionInput = this.finishedQuestionInput.bind(this);
  }

  render() {
    return (
      <div className="col" style={{height: "100%", overflowY: "auto", paddingTop: "5px"}}>
        {this.genCommunityHeader()}
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h5>Questions</h5>
            {this.genQuestionButton()}
        </div>
        <QuestionForm
          show={this.state.showQuestionInput}
          close={this.hideQuestionInput}
          finished={this.finishedQuestionInput}
          communityInfo={this.props.communityInfo}
          tokens={this.props.tokens}
        />
        <ul className="list-group mb-3">
          {this.genFeedList()}
        </ul>
      </div>
    )
  }

  genCommunityHeader() {
    if (!this.props.communityInfo) {
      return null;
    } else {
      return (
        <div className='container-fluid'>
          <div className='d-flex align-items-center'>
            <h3 className="h3">
              <b>{this.props.communityInfo.name}</b>
            </h3>
            <CommunityJoin 
              joined={this.props.joined} 
              finished={this.props.updateCommunities}
              tokens={this.props.tokens}
              community={this.props.communityInfo._id}/>
            </div>
          <p><small>
            {this.props.communityInfo.description}
          </small></p>
        </div>
      );
    }
  }

  genFeedList() {
    return (this.props.feed.map(q => (
      <a 
        href="#"
        className="list-group-item list-group-item-action"
        onClick={this.props.selectQuestion}
        key={q._id}
        id={q._id}
        style={{height: "100px"}}
      >
        <h6><b>{q.title}</b></h6>
        <div className='text-truncate'>
          {q.content}
        </div>
      </a>
    )));
  }
  
  genQuestionButton() {
    if (!this.props.tokens) {
      return null
    }
    if (this.state.showQuestionInput) {
      return null
    }
    return (
      <button 
        type="button" 
        className="btn btn-primary" 
        style={{margin: "5px"}}
        onClick={this.showQuestionInput}
      >
        Ask a Question
      </button>
    );
  }

  showQuestionInput() {
    this.setState({
      showQuestionInput: true
    })
  }

  hideQuestionInput() {
    this.setState({
      showQuestionInput: false
    })
  }
  
  finishedQuestionInput() {
    this.setState({
      showQuestionInput: false
    });

    this.props.updateFeed();
  }
    
}




export default CommunityFeed;