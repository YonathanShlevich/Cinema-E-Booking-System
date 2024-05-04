import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';
import axios from "axios";


function OrderSummary() {

  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const [movieFromURL, setMovieFromURL] = useState("");
  const [showtimeFromURL, setShowtimeFromURL] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
 // --------------------------------------------------------

 useEffect(() => {
  const getLoggedInUserId = () => {
    return localStorage.getItem('loggedInUserId');
  };
  setLoggedInUserId(getLoggedInUserId());
}, []);

useEffect(() => {
  const getMovieFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('movieTitle');
  };
  const movieTitle = getMovieFromURL();
  if (movieTitle) {
    setMovieFromURL(movieTitle);
  }
}, [location.search]);

useEffect(() => {
  const getShowtimeFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('showtime');
  };
  const showtime = getShowtimeFromURL();
  if (showtime) {
    setShowtimeFromURL(showtime);
    axios.get(`http://localhost:4000/showtime/pullShowtimeFromID/${showtime}`)
    .then(response => {
      if (response.data.status === "FAILED") {
        // do nothing
        console.log(response.data.message)
      } else {

        setShowtimeFromURL(response.data)
       
      }
    })
    .catch(error => { 
      console.error('Error fetching showtime info:', error);
    });

  }
}, [location.search]);

useEffect(() => {
  const getSeatsFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get('seats');
  };
  const encodedSeats = getSeatsFromURL();
  if (encodedSeats) {
    // Decode the URL-encoded string
    const decodedSeatsString = decodeURIComponent(encodedSeats);

    // Parse the JSON string into a JavaScript array
    const selectedSeats = JSON.parse(decodedSeatsString);
    console.log(selectedSeats)
    setTickets(selectedSeats);
  }
}, [location.search]);







  // ---------------------------------------------------------

  const handleDelete = (id) => {
    // Filter out the ticket with the specified ID
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    
    // Update the state with the filtered tickets
    setTickets(updatedTickets);
  };

  const navigate = useNavigate();
  const handleUpdate = () => {
    navigate(`/bookticket?movieTitle=${movieFromURL}&showtime=${encodeURIComponent(showtimeFromURL._id)}&seats=${encodeURIComponent(JSON.stringify(tickets))}`);
  }

  const handleConfirm = () => {
    navigate("/bookticket/checkout")
  }

  // Calculate total price
  const totalPrice = tickets.reduce((acc, ticket) => acc + ticket.price, 0);

  return (
    <div>
      <Link to="/" className="backbutton">Cancel Order</Link>
      <div className="card">
        <div className="card-header">
          <h2>Order Summary</h2>
        </div>
        <div className="card-body">
            <div>Movie Title: {movieFromURL}</div>
            <div>Show Time: {showtimeFromURL.date && showtimeFromURL.date.substring(0,10)} {showtimeFromURL.period && showtimeFromURL.period.time}</div>
          {tickets.map(ticket => (
            <div key={ticket.id}>
              
              <div>{ticket.seatNumber} {ticket.age}- - - - $price here <button onClick={() => handleDelete(ticket.id)}>Delete</button></div>
              
            </div>
          ))}
          <div>Online Fee: $3</div>
          <div>Tax: ${(totalPrice * .07).toFixed(2)}</div>
          <div></div>
          <div>Total Price: ${(totalPrice + (totalPrice * .07) + 3).toFixed(2)}</div>
          <button className="btn btn-primary" onClick={handleConfirm}>Confirm and Checkout</button>
          <button onClick={handleUpdate}>Update Order</button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
