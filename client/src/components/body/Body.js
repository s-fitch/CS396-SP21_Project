import React from 'react';
import Landing from './Landing';
import CommunityFeed from './CommunityFeed';
import QuestionView from './QuestionView';

class Body extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      communityInfo: null,
      feed: [],
      question: null,
    }

    this.selectQuestion = this.selectQuestion.bind(this);
    this.closeQuestion = this.closeQuestion.bind(this);
    this.updateFeed = this.updateFeed.bind(this);
  }

  render () {
    if (!this.props.community) {
      return (<Landing />);
    } else if (!this.state.question) {
      return (
        <CommunityFeed
          communityInfo={this.state.communityInfo}
          feed={this.state.feed}
          selectQuestion={this.selectQuestion}
          tokens={this.props.tokens}
          joined={this.props.communities.map(c=>c._id).includes(this.props.community)}
          updateFeed={this.updateFeed}
          updateCommunities={this.props.updateCommunities}
        />
      );
    } else {
      return (
        <QuestionView 
          community={this.props.community}
          question={this.state.question}
          tokens={this.props.tokens}
          close={this.closeQuestion}
        />
      );
    }
  }

  componentDidMount () {
    if (this.props.community) {
      this.updateInfo();
      this.updateFeed();
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.community !== this.props.community) {
      this.setState({
        question: null
      })
      if (this.props.community) {
        this.updateInfo();
        this.updateFeed();
      }
    }
  }

  updateInfo() {
    /** 
     * Update Community information  
     */
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}`, 
      { method: 'GET' }
      )
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            return;
          }

          this.setState({
            communityInfo: data
          })
        });
  }

  updateFeed() {
    /**
     * Update Community question feed
     */
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/feed`, 
      { method: 'GET' }
      )
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data);
            return;
          }

          this.setState({
            feed: data.questions
          })
        })
        .catch(err => console.log(err));
    }

    selectQuestion (ev) {
      /**
       * Select question from community feed
       */
      this.setState({
        question: ev.target.closest('a').id
      });
    }

    closeQuestion (ev) {
      /**
       * Unselect question from community
       */
      this.setState({
        question: null
      });
    }
    
}

export default Body;