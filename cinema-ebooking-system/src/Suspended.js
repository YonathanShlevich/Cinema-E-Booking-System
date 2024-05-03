import React from 'react';
import { Link } from 'react-router-dom';
import './Suspended.css';

function Suspended() {
  return (
    <div>
      <div>
        <Link to="/login" className="backbutton">Back to Login</Link>
      </div>
      <div className="suspended-container">
        <img src="./suspended.gif" alt="Suspended Image" className="suspended-image" />
        <h1 className="suspended-heading">Your Account has been Suspended</h1>
        <p className="suspended-text">Please contact OnlyReels to resolve this situation.</p>
      </div>
    </div>
  );
}

export default Suspended;
