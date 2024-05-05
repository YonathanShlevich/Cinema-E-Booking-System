import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PastBooking() {
  const [bookingInfo, setbookingInfo] = useState(null);
  const userId = localStorage.getItem('loggedInUserId');

  useEffect(() => {
    axios.get(`http://localhost:4000/booking/pullBookingsfromUserId/${userId}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error
        } else {
            setbookingInfo(response.data);
            window.alert(JSON.stringify(response.data));
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, []);

  return (
    <div>
      <Link to="/viewprofile" className="backbutton"> Back to Profile</Link>
      <div className="card">
        <div className="card-header">
          <h2>Past Bookings</h2>
        </div>
        {bookingInfo && (
          <>
            <div>
              {/* Showtime Display */}
              <strong>Showtime:</strong> {bookingInfo.showTime}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PastBooking;
