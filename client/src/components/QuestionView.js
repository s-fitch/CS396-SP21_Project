import React from 'react';

class QuestionView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            questionInfo: {},
            answers: [],
            inputAnswer: false, 
            answerText: ''
        }
        this.openAnswer = this.openAnswer.bind(this);
        this.closeAnswer = this.closeAnswer.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
    }

    render () {
        let answers = null;
        if (this.state.answers) {
            answers = this.state.answers.map(a => (
                <li 
                    className="list-group-item"
                    key={a._id}
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
            {this.genAnswerForm()}
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

        fetch(`${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/q/${this.props.question}`, {
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
        })
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
            inputAnswer: true
        })
    }
    closeAnswer() {
        this.setState({
            inputAnswer: false
        })
    }
    handleChange(ev) {
        this.setState({
            answerText: ev.target.value
        })
    }
    submitAnswer() {
        if (this.state.answerText === "") {
            return;
        }

        // Compose post for answer
        const answer = {
            'content': this.state.answerText
        }
        
    
        fetch(`${process.env.REACT_APP_BACKEND_URL}/c/${this.props.community}/q/${this.props.question}/a`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${this.props.tokens.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answer)
        })
        .then(response => {
            if (response.status === 204) {
                this.setState({
                    answerText: "",
                    inputAnswer: false
                })
        
                this.updateInfo()
            } else {
                console.log('Request failed with code ' + response.status)
            }
        })
        .catch(err => console.log(err))


        
    }

    genAnswerButton() {
        if (!this.props.tokens){
            return null
        } else if (this.state.inputAnswer) {
            return null;
        } else {
            return (
                <button 
                    type="button" 
                    className="btn btn-primary " 
                    style={{margin: "5px"}}
                    onClick={this.openAnswer}>
                        Answer
                </button>
            )
        }
    }

    genAnswerForm() {
        if (!this.state.inputAnswer) {
            return null;
        }
        
        return (
        <form className="container-fluid card">
            <div className="mb-3">
                <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Write your answer..."
                    onChange={this.handleChange}></textarea>
            </div>
            <div style={{marginLeft: "auto"}}>
                <button
                        type="button"
                        className="btn btn-outline-secondary ml-auto"
                        style={{width: "100px"}}
                        onClick={this.closeAnswer}>
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
        </form>
        );
        
    }

}
export default QuestionView;