import React, { Component } from 'react';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import './Verify.css';
import logo from './test.jpg';

class Verify extends Component {

    constructor(props) {
        super(props);
        this.state = {
          startDate: new Date()
        };
        this.handleChange = this.handleChange.bind(this);
      }
     
      handleChange(date) {
        this.setState({
          startDate: date
        });
      }

    render () {
        return (
            <div className='container-fluid'>
            <img className='logo1' src={logo} alt='nothing'></img>
            <div className='parag'>Thank you for uploading the image.</div>
            <div className='parag1'>You will be notified when the missing person is identified.</div>
            <div className='parag2'>Please enter your email so we can contact you.</div>
            <form className="email">
                <div className='parag2'>Please enter your email so we can contact you.</div>
                <input type="text" className="email" name="email" />
                <div className="parag2">Please enter the missing persons full name</div>
                <input type="text" className="email" name="name" />
                <div className="parag2">Please enter the last time they were seen</div>
            </form>
            <DatePicker className="date"
                    selected={this.state.startDate}
                    onChange={this.handleChange}
            />
            <button className='submit'>Thank You</button>
            </div>
        );
    }

}

export default Verify