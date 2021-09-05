import React from 'react';
import CommunityForm from './CommunityForm';
import CommunitySearch from './CommunitySearch';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addCommunity: false
    }
    this.showAddCommunity = this.showAddCommunity.bind(this);
    this.hideAddCommunity = this.hideAddCommunity.bind(this);
    this.finishedAddCommunity = this.finishedAddCommunity.bind(this);
  }

  render() {
    return (
      <div style={{height: '100%', overflowY: "auto", padding: "5px"}}>
        {this.props.tokens && (
          <div className="mb-5">
            <h5 className="mt-3">Your Communities</h5>
            <ul className="list-group" >
              {this.props.communities.map(comm => (
                <a 
                  key={comm._id}
                  href="#" 
                  className="list-group-item list-group-item-action" 
                  id={comm._id}
                  onClick={this.props.selectCommunity}
                >
                  {comm.name}
                </a>
              ))}
            </ul>
          </div>
        )}
        <h5 className="mt-3">Explore</h5>
        {this.props.tokens && ((this.state.addCommunity) ? (
          <CommunityForm 
            close={this.hideAddCommunity}
            finished={this.finishedAddCommunity}
            tokens={this.props.tokens}
          />
        ) : (
          <button
            type="button"
            className="btn btn-primary mb-2"
            style={{width: "100%"}}
            onClick={this.showAddCommunity}
          >
            Create a Community
          </button>
        ))}
        <CommunitySearch 
          selectCommunity={this.props.selectCommunity}
        />        
      </div>
    )
  }

  componentDidMount() {
    if (this.props.tokens) {
      this.props.updateCommunities();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tokens && prevProps.tokens !== this.props.tokens) {
      this.props.updateCommunities()
    }
  }
  
  showAddCommunity() {
    this.setState({
      addCommunity: true
    })
  }
  
  hideAddCommunity() {
    this.setState({
      addCommunity: false
    })
  }
  
  finishedAddCommunity() {
    this.hideAddCommunity()
    this.props.updateCommunities();
  }

}

export default Sidebar;