import React, { Component } from 'react';
import logo from './logo.png';
import back from './back.png';
import ImageUploader from 'react-images-upload';
import './Uploader.css'

const maxFileSize = 5242880
class Uploader extends Component {
  
    constructor(props) {
    super(props);  
    this.state= {
        pictures: []
    }
    this.onDrop = this.onDrop.bind(this);
    this.PersonGroupUriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/c47803da-576f-41d8-a28e-7659f1ff171c';
   
    this.subscriptionKey = '02a4dbfb233f42869ba5cc1ff089006d';
    this.personGroupId = 'c47803da-576f-41d8-a28e-7659f1ff171c';
    this.request = require('request');;

  }  
  onDrop(picture) {
    this.setState({
        pictures: this.state.pictures.concat(picture)     
    });

    // I will pretend that the image has been uploaded at this part
    console.log("Image has been uploaded!");

    
    this.PersonGroupParams = {
      'personGroupId': 'c47803da-576f-41d8-a28e-7659f1ff171c'
    };

    // 1. Add Person to PersonGroup 
    this.PersonGroupOptions = {
      uri: this.PersonGroupUriBase,
      qs: this.PersonGroupParams,
      body: null,
      headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key' : this.subscriptionKey
      }
    };

   
    // @Brandon. This should be using data from the forms
    var name = "TestName";
    var missingDate = "";
    var userData = "This person went missing at: " +  missingDate;
    this.PersonGroupOptions.body = '{"name": ' + '"' + name + ' , "userData": ' + '"' + userData + '"}';

    this.request.post(this.PersonGroupOptions, (error, response, body) => {
      if (error) {
        console.log('Error: ', error);
        return;
      }
      let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
      console.log('JSON Response\n');
      console.log(jsonResponse);
    });
  }
 


  render() {
  
        return (
          <div className="container-fluid">
          <img className='logo1' src={logo} alt='nothing'></img>
          <div className='welcome'>Welcome to Domain Lettuce</div>
          <div className='welcome2'>If you know of a missing person, upload their picture here.</div>
          <div className='parag1'>You will be notified when the missing person is identified.</div>
          <div className='parag2'>Please enter a the missing persons name.</div>
          <form className="email">
              <input type="text" className="email" name="email" />
          </form>
          <div className='parag2'>Please enter the last date the person was seen.</div>
          <form className="email">
              <input type="text" className="email" name="email" />
          </form>
          <div className='parag2'>Please enter your email so we can contact you.</div>
          <form className="email">
              <input type="text" className="email" name="email" />
          </form>

          <ImageUploader
            buttonText='Upload Image'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={maxFileSize}/>
            <button className='submit'>Submit</button>

          </div>
        );
  }

  
}

export default Uploader;