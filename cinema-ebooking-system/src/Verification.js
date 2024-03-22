import React from 'react';
import { Link } from 'react-router-dom';
import './Verification.css';


function Verification() {

  return (
    <div className="cardVerification">
      {/* Code for form */}
      <div className="cardverify">
        {/* Verification Code Display */}
        <h5 className="card-title">Enter Verification Code</h5>
        <input
          type="text"
          className="formcontrolVerification"
          placeholder="Enter verification code"
        />
        {/* Links at the bottom the card */}
         <Link to= "/loggedin">
            <button type="submit" className="btn-submit">Submit</button>
        </Link>
        <p className="card-text">Code was sent to this email:example@example.com </p>
      </div>
    </div>
  );
}

export default Verification;
