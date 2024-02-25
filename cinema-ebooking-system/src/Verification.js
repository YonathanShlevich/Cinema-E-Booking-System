import React from 'react';
import { Link } from 'react-router-dom';
import './Verification.css';


function Verification() {
  return (
    <div className="cardVerification">
      <div className="cardverify">
        <h5 className="card-title">Enter Verification Code</h5>
        <input
          type="text"
          className="formcontrolVerification"
          placeholder="Enter verification code"
        />
         <Link to= "/">
            <button type="submit" className="btn-submit">Submit</button>
        </Link>
        <p className="card-text">Code was sent to this email:example@example.com </p>
      </div>
    </div>
  );
}

export default Verification;
