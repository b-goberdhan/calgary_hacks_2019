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
  }  
  onDrop(picture) {
    this.setState({
        pictures: this.state.pictures.concat(picture)
    });
  }
 


  render() {
  
        return (
          <div className="container-fluid">
          <img className='logo1' src={logo} alt='nothing'></img>
          <ImageUploader
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={maxFileSize}/>
            <div className='welcome'>Welcome to Domain Lettuce</div>
            <div className='welcome2'>If someone is missing, upload their picture here.</div>
          </div>
        );
  }

  
}

export default Uploader;