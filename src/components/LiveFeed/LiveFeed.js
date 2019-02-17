import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './LiveFeed.css'
import { request } from 'request';

class LiveFeed extends Component {
  constructor(props) {
    super(props);
    this.setTimer();

    this.uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
    this.request = require('request');;
    this.subscriptionKey = '02a4dbfb233f42869ba5cc1ff089006d';

    this.params = {
      'returnFaceId': 'true',
      'returnFaceLandmarks': 'false',
      'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
          'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
    };
    
    this.options = {
      uri: this.uriBase,
      qs: this.params,
      body: null,
      headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key' : this.subscriptionKey
      }
    };
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
    }, 8000);
  }
  setWebCamRef = webcam => {
    this.webcam = webcam;
  };
  getSnapshot() {
    this.imageData = this.webcam.getScreenshot();
    this.detectFace();
    console.log(this.imgSrc);
  }
  stopTimer() {
    clearInterval(this.timer);
  }

  detectFace() {
    this.options.body = this.imageData;
    this.request.post(this.options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);
      });
  }
}

export default LiveFeed;