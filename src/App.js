import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LiveFeed from './components/LiveFeed/LiveFeed';
class App extends Component {
  render() {
    return (
      <div className="App">
        <LiveFeed/>
      </div>
    );
  }
}

export default App;
