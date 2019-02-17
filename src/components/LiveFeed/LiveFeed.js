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
    // Timer
    this.setTimer();

    this.foundPerson = false;
    this.threshold = 0.60;

    // API endpoints
    this.uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
    this.uriBaseIdentify = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify';

    this.imgSrc = 'https://i.imgur.com/gJpYe4G.jpg'

    // this.imgSrc = 'https://www.childprotection.sa.gov.au/sites/default/files/styles/banner/public/addressing-child-safety_banner_edit.jpg'

    // HTTP Request
    this.request = require('request');
    this.subscriptionKey = '38c94e521d8c4dae94efbd7683e1d57f';
    this.personGroupId = '38c94e521d8c4dae94efbd7683e1d57d';
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
        'Ocp-Apim-Subscription-Key': this.subscriptionKey
      }
    };

    // Initialize Firebase
    this.config = {
      apiKey: "",
      authDomain: "calgaryhacks2019test.firebaseapp.com",
      databaseURL: "https://calgaryhacks2019test.firebaseio.com",
      projectId: "calgaryhacks2019test",
      storageBucket: "calgaryhacks2019test.appspot.com",
      messagingSenderId: "592041089610"
    }
    firebase.initializeApp(this.config);
  }

  render() {
    var display1 = (<div className="Container-fluid">
      <div className="web-cam text-center">
        <Webcam
          ref={this.setWebCamRef}
          screenshotFormat="image/jpeg" className="Feed" />
      </div>
    </div>);
    var display2 = (<div className="Container-fluid">
      <div className="web-cam">
        <Webcam
          ref={this.setWebCamRef}
          screenshotFormat="image/jpeg" className="Feed" />
      </div>
      <div className='alert'>
        <div className='head'>MISSING PERSON FOUND</div>
        <div className='name'>{this.foundPersonName}</div>
        <div className='desc'>{this.foundPersonSummary}</div>
      </div>
    </div>);
    return this.foundPerson ? display2 : display1;

  }
  setTimer() {
    this.timer = setInterval(() => {
      this.getSnapshot();
    }, 10000);
  }
  setWebCamRef = webcam => {
    this.webcam = webcam;
  };
  getSnapshot() {
    this.imageData = this.webcam.getScreenshot();
    this.UploadScreenshotAndCallApi();
  }
  stopTimer() {
    clearInterval(this.timer);
  }
  UploadScreenshotAndCallApi() {
    // Get reference to firebase app
    var storageRef = firebase.storage().ref();
    // Get reference to image
    var imageRef = storageRef.child('image.jpg');

    // Upload image to firebase
    imageRef.putString(this.imageData, 'data_url').then(function (snapshot) {
      console.log('Uploaded screenshot');
    });

    // Get the download URL from firebase
    imageRef.getDownloadURL().then(function (url) {
      this.detectFace(url);
    }.bind(this)).catch(function (error) {
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

  detectFace(url) {
    // eslint-disable-next-line
    this.options.body = '{"url": ' + '"' + url + '.jpg' + '"}';
    this.request.post(this.options, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);
      let detectedFaces = JSON.parse(jsonResponse);

      var faceIDs = []

      for (var i = 0; i < detectedFaces.length; i++) {
        console.log(detectedFaces[i].faceId);
        faceIDs.push('"' + detectedFaces[i].faceId + '"');
        console.log(faceIDs[i]);
      }

      // If we get faceIds, send it to microsoft for match
      if (faceIDs.length > 0) {
        var OptionsFaceIdentify = {
          uri: this.uriBaseIdentify,
          body: null,
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': this.subscriptionKey
          }
        };

        //OptionsFaceIdentify.body = '{"personGroupId": ' + '"' + this.personGroupId + '", "faceIds": [ "527f39b5-24d2-4104-b25a-012b822e0130", "5c83b373-ef9c-4624-8bdf-77e8d24bd1fb" ], "maxNumOfCandidatesReturned": 1, "confidenceThreshold": 0.5 }';
        // eslint-disable-next-line
        OptionsFaceIdentify.body = '{"personGroupId": ' + '"' + this.personGroupId + '", "faceIds": [' + faceIDs + '], "maxNumOfCandidatesReturned": 1, "confidenceThreshold": 0.5}';

        this.request.post(OptionsFaceIdentify, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          let jsonResponse2 = JSON.stringify(JSON.parse(body), null, '  ');
          console.log('JSON Response\n');
          console.log(jsonResponse2);

          let potentialMatches = JSON.parse(jsonResponse2);

          var matchingFace = null;

          for (var i = 0; i < potentialMatches.length; i++) {
            console.log(potentialMatches[i].candidates[0]);
            //console.log(potentialMatches[i].candidates[0].confidence);
            if (potentialMatches[i].candidates.length > 0 && potentialMatches[i].candidates[0].confidence > this.threshold) {
              console.log(potentialMatches[i].candidates[0].personId + " has made been found");
              matchingFace = potentialMatches[i].candidates[0].personId;
              break;
            }
          }

          // If we get a matchingFace, send it to microsoft
          if (matchingFace !== null) {
            console.log("Finding data for " + matchingFace);

            var GetGroupPersonParams = {
              'personGroupId': this.personGroupId,
              'personId': matchingFace
            };

            var uriBaseIdentify = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/' + this.personGroupId + '/persons/' + matchingFace
            var GetGroupPersonOptions = {
              uri: uriBaseIdentify,
              qs: GetGroupPersonParams,
              body: null,
              headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.subscriptionKey
              }
            };

            this.request.get(GetGroupPersonOptions, (error, response, body) => {
              if (error) {
                console.log('Error: ', error);
                return;
              }
              let jsonResponse3 = JSON.stringify(JSON.parse(body), null, '  ');
              console.log('JSON Response\n');
              console.log(jsonResponse3);

              let match = JSON.parse(jsonResponse3);
              this.foundPerson = true;
              this.foundPersonName = match.name;
              this.foundPersonSummary = match.userData;
              this.setState({});
              console.log("### Match Found! ###\nName: " + match.name + "\nUser Data: " + match.userData)
            });
          }
        });
        // {
        //     "personGroupId": "c47803da-576f-41d8-a28e-7659f1ff171c",
        //     "faceIds": [
        //         "527f39b5-24d2-4104-b25a-012b822e0130",
        //         "5c83b373-ef9c-4624-8bdf-77e8d24bd1fb"
        //     ],
        //     "maxNumOfCandidatesReturned": 1,
        //     "confidenceThreshold": 0.5
        // }
      }
    });
  }
}

export default LiveFeed;
