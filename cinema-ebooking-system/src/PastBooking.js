import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function PastBooking() {
  const [userInfo, setUserInfo] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/user/booking/pullBookingsfromUserId/${userId}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error
        } else {
          setUserInfo(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [userId]);

  return (
    <div>
      <Link to="/viewprofile" className="backbutton"> Back to Profile</Link>
      <div className="card">
        <div className="card-header">
          <h2>Past Bookings</h2>
        </div>
        {userInfo && (
          <>
            <div>
              {/* Fisrt name Display */}
              <strong> Name:</strong> {userInfo.ticket}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PastBooking;