// ViewProfile.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./ViewProfile.css";

function ViewProfile() {

  const [userInfo, setUserInfo] = useState(null);

  //Pulling data from our backend using a Use Effect block
  useEffect(() => {
    //Pulls the userID and sets response to second var
    const userId = localStorage.getItem('loggedInUserId');
    axios.get(`http://localhost:5000/user/data/${userId}`) //Calls our data backend GET call
      .then(response => {
        setUserInfo(response.data); // Set user info to the response data
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);
  // Make GET request to fetch user data

  //TODO: Get request to pull the information in
  return (
    <div>
      {/* Code for showing the profile */}
      <Link to="/" className="backhome"> Back to Home</Link>
      <Link to="/" className="logoutbutton">Logout</Link>
      <div className="profile-card">
        <h2>User Profile</h2>
        <div>
          {/* Fisrt name Display */}
          <strong>Fist Name:</strong> {userInfo.firstName}
        </div>
        <div>
          {/* Name Display */}
          <strong>Last Name:</strong> {userInfo.lastName}
        </div>
        <div>
          {/* Phone Number Display */}
          <strong>Phone Number:</strong> {userInfo.phoneNumber}
        </div>
        <div>
          {/* Email Display */}
          <strong>Email:</strong> {userInfo.email}
        </div>
        <div>
          {/* Address Display */}
          <strong>Home Address:</strong> 123 Sample Drive, Athens, GA, 12345
        </div>
        <hr />
        <div>
          {/* Cards Display */}
          <strong>Saved Cards:</strong>
        </div>
        <div className="saved-cards">
          <p className='cardinfo'>Visa ****1234</p>
          <button id='deletebutton'> -Delete Card</button>
        </div>
        <div>
          {/* Subscription Display */}
          <strong>Subscribed for Promo:</strong> Yes
        </div>
        {/* User actions */}
        <div className='useractions'>
          <Link to="/editprofile" id="editprofile">Edit Profile</Link>
          <Link to="/changepassword" id="changepassword">Change Password</Link>
        </div>
      </div>
    </div>
  );
}

export default ViewProfile;
