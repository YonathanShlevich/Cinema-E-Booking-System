import React from 'react';
import { Link } from 'react-router-dom';
import './Verification.css';


function Verification() {

  return (
    <div className="cardVerification">
      {/* Code for form */}
      <div className="cardverify">
        {/* Verification Code Display */}
        <h2 className="card-title">Verify your email, then login</h2>
        
        {/* Links at the bottom the card */}
         <Link to= "/login">
            <button className="btn-submit">Proceed to Login</button>
        </Link>
        <p className="card-text">Link was sent to your inbox</p>
      </div>
    </div>
  );
}

export default Verification;
