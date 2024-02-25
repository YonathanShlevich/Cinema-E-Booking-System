// ViewProfile.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./ViewProfile.css";

function ViewProfile() {
    
  return (
    <div>
      <Link to="/loggedin" className="backhome"> Back to Home</Link>
      <Link to="/" className="logoutbutton">Logout</Link>
      <div className="profile-card">
        <h2>User Profile</h2>
        <div>
          <strong>Name:</strong> John Doe
        </div>
        <div>
          <strong>Phone Number:</strong> 123-123-1231
        </div>
        <div>
          <strong>Email:</strong> chouses@gmail.com
        </div>
        <div>
          <strong>Home Address:</strong> 123 Sample Drive, Athens, GA, 12345
        </div>
        <hr />
        <div>
          <strong>Saved Cards:</strong>
        </div>
        <div className="saved-cards">
          <p className='cardinfo'>Visa ****1234</p>
          <button id='deletebutton'> -Delete Card</button>
        </div>
        <div className='useractions'>
          <Link to="/editprofile" id="editprofile">Edit Profile</Link>
          <Link to="/changepassword" id="changepassword">Change Password</Link>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
