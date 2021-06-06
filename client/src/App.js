import React from 'react';
import './App.css';

import Header from './Header';
import Body from './Body';

class App extends React.Component {
  render () {
    return (
      <div style={{height: '100vh'}}>
        <Header />
        <Body />
      </div>
    )
  }
}

export default App;
