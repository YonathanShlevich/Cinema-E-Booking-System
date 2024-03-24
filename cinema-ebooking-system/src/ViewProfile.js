import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./ViewProfile.css";

function ViewProfile() {

  const [userInfo, setUserInfo] = useState(null); //Used for User's info
  const [homeInfo, setHomeInfo] = useState(null); //Home info
  const [cardInfo, setCardInfo] = useState(null); //Card info, TODO: How to only store 3 cards
  const userId = localStorage.getItem('loggedInUserId');

  //Pulling data from our backend using a Use Effect block: User
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:5000/user/data/${userId}`) //Calls our data backend GET call
      .then(response => {
        setUserInfo(response.data); //Set user info to the response data
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  //Pulling data from our backend using a Use Effect block: Home Address
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:5000/user/data/homeAddr/${userId}`) //Calls our data backend GET call
      .then(response => {
        setHomeInfo(response.data); //Set user info to the response data
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);
 
  //Same as previous 2 but for payment card info
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:5000/user/data/paymentCard/${userId}`) //Calls our data backend GET call
      .then(response => {
        setCardInfo(response.data); //Set user info to the response data
      })
      .catch(error => { 
        console.error('Error fetching user info:', error);
      });
  }, []);

  //TODO: Get request to pull the information in
  return (
    <div>
      {/* Code for showing the profile */}
      <Link to="/" className="backhome"> Back to Home</Link>
      <Link to="/" className="logoutbutton">Logout</Link>
      <div className="profile-card">
        <h2>User Profile</h2>
        {userInfo && (
          <>
            <div>
              {/* Fisrt name Display */}
              <strong>First Name:</strong> {userInfo.firstName}
            </div>
            <div>
              {/* Last name Display */}
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
          </>
        )}
        {homeInfo && (
          <>
            <div>
            {/* Address Display */}
            <strong>Home Address:</strong> {homeInfo.homeAddr}, {homeInfo.homeCity}, {homeInfo.homeState}
          </div>
          </>
        )}
        <hr />
        {cardInfo && (
          <>
            <div>
              {/* Cards Display */}
              <strong>Saved Cards:</strong>
            </div>
            <div className="saved-cards">
              <p className='cardinfo'>{cardInfo.cardType} ****{cardInfo.cardNumber.toString().slice(-4)}</p>
              <button id='deletebutton'> -Delete Card</button>
            </div>
          </>
        )}
        {userInfo && (
          <>
            <div>
            {/* Subscription Display */}
            <strong>Subscribed for Promo:</strong> {userInfo.promo ? 'Yes' : 'No'} {/* Checks if promo is true */}
            </div>  
          </>
        )}
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
