import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './LiveFeed.css'
class LiveFeed extends Component {
  constructor(props) {
    super(props);
    this.setTimer();
    
  }  

  render() {
        return (
          <div className="Container">
            <Webcam 
              ref={this.setWebCamRef}
              screenshotFormat="image/jpeg" className="Feed" />
          </div>
        );
    }
  setTimer() {
    this.timer = setInterval(() => {
      this.getSnapshot();
    }, 3000);
  }
  setWebCamRef = webcam => {
    this.webcam = webcam;
  };
  getSnapshot() {
    this.imgSrc = this.webcam.getScreenshot();
    console.log(this.imgSrc);
  }
  stopTimer() {
    clearInterval(this.timer);
  }
}

export default LiveFeed;