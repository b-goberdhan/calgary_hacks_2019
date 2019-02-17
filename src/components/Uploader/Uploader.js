import React, { Component } from 'react';
import logo from './logo.png';
import back from './back.png';
import ImageUploader from 'react-images-upload';
import './Uploader.css'
import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/storage';

const MAX_FILE_SIZE = 5242880;
class Uploader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      pictures: [],
      name: '',
      date: '',
      email: ''
    }

    // Bind functions
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.imgSrc = 'https://i.imgur.com/gJpYe4G.jpg';

    // HTTP request
    this.PersonGroupUriBase =
      'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/38c94e521d8c4dae94efbd7683e1d57d/persons';



    this.subscriptionKey = '38c94e521d8c4dae94efbd7683e1d57f';
    this.personGroupId = '38c94e521d8c4dae94efbd7683e1d57d';
    this.request = require('request');;
	
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

  // When the user chooses a photo(s) from their local machine
  onDrop(pictureFiles, pictureDataURLs) {

    // Scroll so the image upload preview is in view
    this.scrollToBottom();

    this.setState({
      // Note: pictures gets updates everytime a picture gets uploaded
      // but deleting a photo does not remove it from pictures list
      pictures: this.state.pictures.concat(pictureDataURLs)
    });
  }
  
  UploadPicAndCallApi() {
    // Get reference to firebase app
    var storageRef = firebase.storage().ref();
    // Get reference to image
    var imageRef = storageRef.child('missingPerson.jpg');

    // Upload image to firebase
    imageRef.putString(this.state.pictures[0], 'data_url').then(function (snapshot) {
      console.log('Uploaded missing person picture');
    });

    // Get the download URL from firebase
    imageRef.getDownloadURL().then(function (url) {
      this.CallVerifyApi(url);
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
  


  // When the user hit the submit button
  onSubmit() {
    /*
    * @Michael
    * If we are only supporting a single photo upload, then just get the upload
    * and get the download URL for that one photo.
    * Otherwise here is where you're going to want to take the list of state.pictures, 
    * which is a list of DataURLS. For each DataURL, you will want to upload each
    * to firebase and then get the download URL for each (like we did in LiveFeed.js)
    * You should create and return here a list of download URLs so that we can send
    * each one to the Face API.
    */
	this.UploadPicAndCallApi();
  }

  // Call the Face API Verify endpoint with our image URL
  CallVerifyApi(url) {
    console.log(url);
    
	// This involves person groups
	this.PersonGroupParams = {'personGroupId': '38c94e521d8c4dae94efbd7683e1d57d'};

    // 1. Add Person to PersonGroup 
    this.PersonGroupOptions = {
      uri: this.PersonGroupUriBase,
      qs: this.PersonGroupParams,
      body: null,
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': this.subscriptionKey
      }
    };

    // @Brandon. This should be using data from the forms
    var name = this.state.name;
    var missingDate = this.state.date;
    var userData = "This person went missing on: " + missingDate;
    // eslint-disable-next-line
    this.PersonGroupOptions.body = '{"name": ' + '"' + name + '" , "userData": ' + '"' + userData + '"}';

    this.request.post(this.PersonGroupOptions, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);
      jsonResponse = JSON.parse(jsonResponse);

      // 2. Add personface to person
      this.personId = jsonResponse.personId;
      console.log(jsonResponse.personId);
      console.log(this.personId);

      this.AddFaceUriBase =
      'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/38c94e521d8c4dae94efbd7683e1d57d/persons/'+ this.personId + '/persistedFaces';


      this.AddFaceParams = {
        'personGroupId': '38c94e521d8c4dae94efbd7683e1d57d',
        'personId':  this.personId
      };

      this.AddFaceOptions = {
        uri: this.AddFaceUriBase,
        qs: this.AddFaceParams,
        body: null,
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey
        }
      };

      this.AddFaceOptions.body = JSON.stringify({"url" : url + ".jpg"});


      this.request.post(this.AddFaceOptions, (error, response, body) => {
        if (error) {
          console.log('Error: ', error);
          return;
        }
        let jsonResponse2 = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('JSON Response\n');
        console.log(jsonResponse2);
      

      //3. Train the Person Group
      this.TrainUriBase =
      'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/38c94e521d8c4dae94efbd7683e1d57d/train';


      this.TrainParams = {
        'personGroupId': '38c94e521d8c4dae94efbd7683e1d57d'      
      };
      
      this.TrainOptions = {
        uri: this.TrainUriBase,
        qs: this.TrainParams,
        body: null,
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': this.subscriptionKey
        }
      };

      this.request.post(this.TrainOptions, (error, response, body) => {
        if (error) {
          console.log('Error: ', error);
          return;
        }
      });
    });
  });

    // Don't forget that when you do get the image download URL from firebase
    // that you need to append '.jpg' to the end of the URL before sending to Face API

    // I will pretend that the image has been uploaded at this part
    console.log("Image has been uploaded!");
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }
  handleDateChange(e) {
    this.setState({ date: e.target.value });
  }
  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }
  scrollToBottom = () => {
    this.pageEnd.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <div className="container-fluid">
        <img className='logo1' src={logo} alt='nothing'></img>
        <div className='welcome'>Welcome to Domain Lettuce</div>
        <div className='welcome2'>If you know of a missing person, upload their picture here.</div>
        <div className='parag1'>You will be notified when the missing person is identified.</div>
        <div className='parag2'>Please enter a the missing persons name.</div>
        <form className="input">
          <input type="text" className="input" name="name" placeholder="John Doe"
            value={this.state.name} onChange={this.handleNameChange} />
        </form>
        <div className='parag2'>Please enter the last date the person was seen.</div>
        <form className="input">
          <input type="date" className="input" name="date"
            value={this.state.date} onChange={this.handleDateChange} />
        </form>
        <div className='parag2'>Please enter your email so we can contact you.</div>
        <form className="input">
          <input type="text" className="input" name="email" placeholder="me@domainlettuce.com"
            value={this.state.email} onChange={this.handleEmailChange} />
        </form>

        <ImageUploader
          buttonText='Upload Image'
          onChange={this.onDrop}
          imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
          maxFileSize={MAX_FILE_SIZE}
          withPreview={true} />
        <button className='submit' onClick={this.onSubmit}>Submit</button>

        {/* dummy div for scroll-to-bottom functionality on image upload */}
        <div ref={(el) => { this.pageEnd = el; }}></div>
      </div>
    );
  }
}

export default Uploader;