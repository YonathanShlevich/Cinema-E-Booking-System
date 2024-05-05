import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./ViewProfile.css";

function ViewProfile() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null); //Used for User's info
  const [homeInfo, setHomeInfo] = useState(null); //Home info
  const [cardInfo, setCardInfo] = useState([]); //Card info, TODO: How to only store 3 cards
  const userId = localStorage.getItem('loggedInUserId');

  //Pulling data from our backend using a Use Effect block: User
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/${userId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setUserInfo(response.data); //Set user info to the response data
        }
        
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  //Pulling data from our backend using a Use Effect block: Home Address
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/homeAddr/${userId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setHomeInfo(response.data); //Set user info to the response data
        }
        
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);
 
  //Same as previous 2 but for payment card info
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/paymentCard/${userId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setCardInfo(response.data.cards)

        }
      })
      .catch(error => { 
        console.error('Error fetching user info:', error);
      });
  }, []);
/* eslint-disable no-restricted-globals */
  function handleDeleteButtonClick(event) {
    const cardId = event.target.value; // Get the ID of the card to be deleted
    const isConfirmed = confirm("Are you sure you want to delete this card?");
    
    if (isConfirmed) {
        // Perform the deletion operation (e.g., send a request to delete the card)
        // Here, you can make an API call to delete the card using the cardId
        deleteCard(cardId);
    }
}
/* eslint-enable no-restricted-globals */

// Function to delete the card (you need to implement this)
function deleteCard(cardId) {
    // Make an API call to delete the card
    // For example:
    // window.alert("delting a card");
    axios.delete(`http://localhost:4000/user/card/${cardId}/${userId}`)
          .then(response => {
            if (response.data.status === "SUCCESS") {
              window.location.reload();
            } else {
              window.alert(response.message)
    
            }
         })
         .catch(error => {
            console.error(error)
         });
    console.log("Deleting card with ID:", cardId);
}
  



  //TODO: Get request to pull the information in
  return (
    <div>
      {/* Code for showing the profile */}
      <Link to="/" className="backhome"> Back to Home</Link>
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
          
          <div className="card-info">
            
              {cardInfo.map(card => (
                  <div key={card._id} className="saved-cards">
                      <p>{card.cardType} ****{card.cardNumber?.toString().slice(-4)}</p>
                      <button id={`deletebutton-${card._id}`} value={card._id} onClick={handleDeleteButtonClick}>- Delete Card</button>
                  </div>
              ))}
              
          </div>
        </>
        )}

      
        
        {cardInfo.length < 3 && (
          <div>
          <Link to="/addcard" id="addcard"> + Add Card</Link>
        </div>
        )
        
        }
        
        {userInfo && (
          <>
            <div>
            {/* Subscription Display */}
            <strong>Subscribed for Promo:</strong> {userInfo.promo ? 'Yes' : 'No'} {/* Checks if promo is true */}
            </div>  
            <div>
            {/* Past Booking Display */}
            <Link to={`/viewprofile/past-booking/${userInfo._id}`} className="edit-button">Past Booking</Link>
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
