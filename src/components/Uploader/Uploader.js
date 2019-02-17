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
        pictures: [],
        name: '',
        date: '',
        email: ''
    }
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);

    this.onDrop = this.onDrop.bind(this);
    this.PersonGroupUriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/persongroups/c47803da-576f-41d8-a28e-7659f1ff171c';
   
    this.subscriptionKey = '02a4dbfb233f42869ba5cc1ff089006d';
    this.personGroupId = 'c47803da-576f-41d8-a28e-7659f1ff171c';
    this.request = require('request');;

  }  
  onDrop(picture) {
    this.scrollToBottom();
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
    var name = this.state.name;
    var missingDate = this.state.date;
    var userData = "This person went missing on: " +  missingDate;
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
  handleEmailChange(e) {
    this.setState({email: e.target.value});
  }
  handleDateChange(e) {
    this.setState({date: e.target.value});
  }
  handleNameChange(e) {
    this.setState({name: e.target.value});
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
              value={this.state.name} onChange={this.handleNameChange}/>
          </form>
          <div className='parag2'>Please enter the last date the person was seen.</div>
          <form className="input">
              <input type="date" className="input" name="date"
              value={this.state.date} onChange={this.handleDateChange}/>
          </form>
          <div className='parag2'>Please enter your email so we can contact you.</div>
          <form className="input">
              <input type="text" className="input" name="email" placeholder="me@domainlettuce.com"
              value={this.state.email} onChange={this.handleEmailChange}/>
          </form>

          <ImageUploader
            buttonText='Upload Image'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={maxFileSize}
            withPreview={true}/>
            <button className='submit'>Submit</button>

            {/* dummy div for scroll-to-bottom functionality on image upload */}
            <div ref={(el) => { this.pageEnd = el; }}></div>
          </div>
        );
  }

  
}

export default Uploader;