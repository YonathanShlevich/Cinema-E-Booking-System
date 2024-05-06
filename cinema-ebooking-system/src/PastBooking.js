import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function PastBooking() {
  const [bookingInfo, setBookingInfo] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('loggedInUserId');
    axios.get(`http://localhost:4000/booking/pullBookingsfromUserId/${userId}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error
          console.error('Failed to fetch booking info:', response.data.message);
        } else {
          setBookingInfo(response.data);
          console.log('Booking info:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching booking info:', error);
      });
  }, []);
  

  return (
    <div>
      <Link to="/viewprofile" className="backbutton"> Back to Profile</Link>
      <div className="card">
        <div className="card-header">
          <h2>Past Bookings</h2>
        </div>
        {bookingInfo.length > 0 ? (
          bookingInfo.map((booking, index) => (
            <div key={index} className="booking-details">
              <h3>Booking {index + 1}</h3>
              <div>
                <strong>Showtime:</strong> {booking.showTime}
              </div>
              <div>
                <strong>Total:</strong> ${booking.total.toFixed(2)}
              </div>
              <div>
                <strong>Tickets:</strong> {booking.tickets.length}
              </div>
            </div>
          ))
        ) : (
          <p>No past bookings found.</p>
        )}
      </div>
    </div>
  );
}

export default PastBooking;
