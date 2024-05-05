import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';
import axios from "axios";

function OrderConfirmation() {

    const [tickets, setTickets] = useState([]);
    const [bookingFromURL, setBookingFromURL] = useState("");
    const [booking, setBooking] = useState(null);

      const totalPrice = tickets.reduce((acc, ticket) => acc + ticket.price, 0);

    const navigate = useNavigate();
    const location = useLocation();

    const backToHome = () => {
        navigate("/")
    }

    useEffect(() => {
      const getBookingFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('booking');
      };
      const booking = getBookingFromURL();
      if (booking) {
        setBookingFromURL(booking);
        console.log(booking)
        axios.get(`http://localhost:4000/Booking/pullBooking/${booking}`)
        .then(response => {
          if (response.data.status === "FAILED") {
            // do nothing
            console.log(response.data.message)
          } else {
            setBooking(response.data)
            console.log(response.data)
           
          }
        })
        .catch(error => { 
          console.error('Error fetching booking info:', error);
        });
    
      }
    }, [location.search]);


  return (

    <div>
      {
        booking &&
        <div className="card">
        <div className="card-header">
          <h2>Order Confirmation</h2>
        </div>
        <div className="card-body">
          <div>Unique Booking ID: {booking._id}</div>
        <div>Movie Title: {booking.showTime.movie.title}</div>
            <div>Show Time: {booking.showTime.date.substring(0,10)} {booking.showTime.period.time}</div>
          {tickets.map(ticket => (
            <div key={ticket.id}>
              
              <div>{ticket.seat} - - - - ${ticket.price.toFixed(2)} </div>
              
            </div>
          ))}
          
          <div>
            {
              booking.promoId &&
              <div>
                Promo Code: {booking.promoId}
              </div>
            }
          </div>
          <div>Charged: ${booking && booking.total}</div>
          <div>Card: {booking.creditCard.cardType} *****{booking.creditCard.cardNumber?.toString().slice(-4)}</div>
            <p>A confirmation email has been sent to your email address</p>
            <button className="btn btn-primary"onClick={backToHome}>Back to Home</button>
        
        </div>

      </div>
      }
      
    </div>

  );
}

export default OrderConfirmation;
