import React from 'react';

class CommunitySearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            results: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
        <div>
        <input
            type="text"
            id="communityTitle"
            className="form-control"
            maxLength={35}
            placeholder="Search Communities..."
            onChange={this.handleChange}
            required/>
        <ul className="list-group mt-3" >
            {this.genResults()}
        </ul>
        </div>
        )
    }

    genResults () {
        return (this.state.results.map(comm => (
            <a 
                href="#" 
                className="list-group-item list-group-item-action" 
                key={comm._id}
                id={comm._id}
                onClick={this.props.selectCommunity}>
                    {comm.name}
            </a>
        )));
    }

    handleChange(ev) {
        if (ev.target.value === "") {
            this.setState({
                results: []
            });
            return;
        }

        fetch(`${process.env.REACT_APP_BACKEND_URL}/c/search?terms=${ev.target.value}`)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    results: data
                })
            })

    }
}
export default CommunitySearch;