import React from 'react';

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
        <div className="col" style={{height: "100%", overflowY: "auto"}}>
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
                tokens={this.props.tokens}/>
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
                    <h3><b>{this.props.communityInfo.name}</b></h3>
                    <p><small>{this.props.communityInfo.description}</small></p>
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
                style={{height: "100px"}}>
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
                onClick={this.showQuestionInput}>
                    Ask a Question
            </button>
        )
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

class QuestionForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            questionTitle: '',
            questionContent: ''
        }
        this.submitAnswer = this.submitAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        if (!this.props.show) {
            return null
        }

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
                    required/>
            </div>
            <div className="mb-3">
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Your full question..."
                    id="questionContent"
                    onChange={this.handleChange}></textarea>
            </div>
            <div style={{marginLeft: "auto"}}>
                <button
                        type="button"
                        className="btn btn-outline-secondary ml-auto"
                        style={{width: "100px"}}
                        onClick={this.props.close}>
                            Cancel
                    </button>
                <button 
                    type="button"
                    className="btn btn-primary ml-2"
                    style={{width: "100px", marginLeft: "5px"}}
                    onClick={this.submitAnswer}>
                        Submit
                </button>
            </div>
        </form>)
    }

    handleChange(ev) {
        console.log(ev.target.value);
        this.setState({
            [ev.target.id]: ev.target.value
        })
    }
    submitAnswer() {
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

        fetch(`/c/${this.props.communityInfo._id}/q`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.props.tokens.access_token}`,
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(question)
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
        .catch(err => console.log(err))
    }
}

export default CommunityFeed;