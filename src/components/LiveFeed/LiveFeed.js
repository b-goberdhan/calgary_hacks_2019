import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './LiveFeed.css';
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';
import { request } from 'request';

class LiveFeed extends Component {
  constructor(props) {
    super(props);
    this.setTimer();

    this.request = require('request');
    this.uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
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
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : this.subscriptionKey
      }
    };

    // Initialize Firebase
    this.config = {
      apiKey: "AIzaSyAV71u5a3CNx7LjycdC211oIsabEnJEvPA",
      authDomain: "calgaryhacks2019test.firebaseapp.com",
      databaseURL: "https://calgaryhacks2019test.firebaseio.com",
      projectId: "calgaryhacks2019test",
      storageBucket: "calgaryhacks2019test.appspot.com",
      messagingSenderId: "592041089610"
    }
    firebase.initializeApp(this.config);
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
  }
  stopTimer() {
    clearInterval(this.timer);
  }

  detectFace() {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('image.jpg');
    imageRef.putString(this.imageData, 'data_url').then(function(snapshot) {
      console.log('Uploaded a thing!');
    });

    // Get the download URL
    imageRef.getDownloadURL().then(function(url) {
      this.callFaceApi(url);
    }.bind(this)).catch(function(error) {
      switch (error.code) {
        case 'storage/object-not-found':
          // File doesn't exist
          console.error('File does not exist');
          break;

        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          console.error('User does not have permission to access the object');
          break;

        case 'storage/canceled':
          // User canceled the upload
          console.error('User canceled the upload');
          break;

        case 'storage/unknown':
          // Unknown error occurred, inspect the server response
          console.error('Unknown error occurred, inspect the server response');
          break;
        default:
          console.error('Could not get download URL');
      }
    });
  }

  callFaceApi(url) {
    this.imageData = url;
    // Send it to Face API
    this.options.body = '{"url": ' + '"' + this.imageData + '.jpg' + '"}';
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