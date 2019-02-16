import React, { Component } from 'react';
import Webcam from 'react-webcam';
class LiveFeed extends Component {
    render() {
        return (
          <div>
            <Webcam/>
          </div>
        );
      }
}

export default LiveFeed;