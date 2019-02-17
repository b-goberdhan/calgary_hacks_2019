import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LiveFeed from './components/LiveFeed/LiveFeed';
import Uploader from './components/Uploader/Uploader';
class App extends Component {
  render() {
    return (
      <div className="App">
        <LiveFeed/>
        <Uploader/>
      </div>
    );
  }
}

export default App;
