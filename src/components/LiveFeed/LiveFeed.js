import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './LiveFeed.css'
import { request } from 'request';

class LiveFeed extends Component {
  constructor(props) {
    super(props);
    this.setTimer();
    this.foundPerson = false;
    this.uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
    this.uriBaseIdentify = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/identify';

    this.imgSrc = 'https://i.imgur.com/gJpYe4G.jpg'
    
    this.threshold = 0.70;
   
    // this.imgSrc = 'https://www.childprotection.sa.gov.au/sites/default/files/styles/banner/public/addressing-child-safety_banner_edit.jpg'
    this.request = require('request');;
    this.subscriptionKey = '';
    this.personGroupId = 'c47803da-576f-41d8-a28e-7659f1ff171c';

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
  }

  render() {
    var display1 = (<div className="Container-fluid">
                      <div className="web-cam">
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
    this.options.body = '{"url": ' + '"' + this.imgSrc + '"}';
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

      for (var i = 0 ; i < detectedFaces.length; i++) 
      {
        console.log(detectedFaces[i].faceId);
        faceIDs.push('"' + detectedFaces[i].faceId + '"');
        console.log(faceIDs[i]);
      }

      // If we get faceIds, send it to microsoft for match
      if(faceIDs.length > 0)
      {
        var OptionsFaceIdentify = {
          uri: this.uriBaseIdentify,
          body: null,
          headers: {
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key' : this.subscriptionKey
          }
        };
        
        //OptionsFaceIdentify.body = '{"personGroupId": ' + '"' + this.personGroupId + '", "faceIds": [ "527f39b5-24d2-4104-b25a-012b822e0130", "5c83b373-ef9c-4624-8bdf-77e8d24bd1fb" ], "maxNumOfCandidatesReturned": 1, "confidenceThreshold": 0.5 }';
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

          for (var i = 0 ; i < potentialMatches.length; i++) 
          {
            console.log(potentialMatches[i].candidates[0]);
            console.log(potentialMatches[i].candidates[0].confidence);
            if (potentialMatches[i].candidates[0].confidence > this.threshold)
            {
              console.log(potentialMatches[i].candidates[0].personId + " has made been found");
              matchingFace = potentialMatches[i].candidates[0].personId;
              break;
            }
          }

          // If we get a matchingFace, send it to microsoft
          if(matchingFace !== null)
          {
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
                  'Ocp-Apim-Subscription-Key' : this.subscriptionKey
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
              console.log("### Match Found! ###\nName: " + match.name + "\nUser Data: " + match.userData  )
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