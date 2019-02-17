import React, { Component } from 'react';
import './Uploader.css'
import ImageUploader from 'react-images-upload';
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
          <ImageUploader 
            buttonText='Choose images'
            onChange={this.onDrop}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={maxFileSize}/>
        );
  }

  
}

export default Uploader;