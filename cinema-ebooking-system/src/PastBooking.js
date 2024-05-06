import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./PastBooking.css"

//function for formatting the date to look better
function formatDateString(dateString) {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}

function PastBooking() {
  const [bookingInfo, setBookingInfo] = useState([]);

  //Pulling from the API
  useEffect(() => {
    const userId = localStorage.getItem('loggedInUserId');
    axios.get(`http://localhost:4000/booking/pullBookingsfromUserId/${userId}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error
          console.error('Failed to fetch booking info:', response.data.message);
        } else {
          // Fetch movie title and format date for each booking
          const fetchBookingDetails = async () => {
            const bookingsWithDetails = await Promise.all(response.data.map(async booking => {
              const bookingId = booking._id;
              const bookingDetailsResponse = await axios.get(`http://localhost:4000/booking/pullBooking/${bookingId}`);
              if (bookingDetailsResponse.data.status === "FAILED") {
                // Handle error
                console.error('Failed to fetch booking details:', bookingDetailsResponse.data.message);
                return booking;
              } else {
                const formattedDate = formatDateString(bookingDetailsResponse.data.showTime.date);
                const updatedBooking = { ...booking, showTime: { ...bookingDetailsResponse.data.showTime, date: formattedDate } };
                return updatedBooking;
              }
            }));
            setBookingInfo(bookingsWithDetails);
          };
          fetchBookingDetails();
        }
      })
      .catch(error => {
        console.error('Error fetching booking info:', error);
      });
  }, []);  

  return (
    <div>
      <Link to="/viewprofile" className="back-to-profile-link"> Back to Profile</Link>
      <div className="container">
        
      </div>
      <div className="past-booking-card">
        <div className="past-booking-card-header">
          <h2>Past Bookings</h2>
        </div>
        {bookingInfo.length > 0 ? (
          bookingInfo.map((booking, index) => (
            <div key={index} className="booking-details">
              <h3><u>Booking {index + 1}</u></h3>
              <div className="booking-details-info">
                <strong>Movie:</strong> {booking.showTime.movie.title}
              </div>
              <div className="booking-details-info">
                <strong>Date:</strong> {booking.showTime.date}
              </div>
              <div className="booking-details-info">
                <strong>Total:</strong> ${booking.total.toFixed(2)}
              </div>
              <div className="booking-details-info">
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
