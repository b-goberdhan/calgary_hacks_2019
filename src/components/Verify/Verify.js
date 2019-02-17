import React, { Component } from 'react';
import './Verify.css'

class Verify extends Component {
    render () {
        return (
            <div className='container-fluid'>
            <div className="upimg">(img)</div>
            <div className='parag'>Thank you for uploading the image.</div>
            <div className='parag1'>You will be notified when the missing person is identified.</div>
            <div className='parag2'>Please enter your email so we can contact you.</div>
            <form className="email">
                <input type="text" className="email" name="email" />
            </form>
            <button className='submit'>Thank You</button>
            </div>
        );
    }

}

export default Verify