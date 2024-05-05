import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';

function OrderConfirmation() {

    const [tickets, setTickets] = useState([]);
    const [booking, setBookingFromURL] = useState("");

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
      const booking = getShowtimeFromURL();
      if (booking) {
        setBookingFromURL(booking);
        axios.get(`http://localhost:4000/showtime/pullShowtimeFromID/${booking}`)
        .then(response => {
          if (response.data.status === "FAILED") {
            // do nothing
            console.log(response.data.message)
          } else {
    
           
          }
        })
        .catch(error => { 
          console.error('Error fetching booking info:', error);
        });
    
      }
    }, [location.search]);


  return (

    <div>
      
      <div className="card">
        <div className="card-header">
          <h2>Order Confirmation</h2>
        </div>
        <div className="card-body">
        <div>Movie Title: Revenant</div>
            <div>Show Time: March 3, 2023, 10:15 AM</div>
          {tickets.map(ticket => (
            <div key={ticket.id}>
              
              <div>{ticket.seat} - - - - ${ticket.price.toFixed(2)} </div>
              
            </div>
          ))}
          <div>Online Fee: $3</div>
          <div>Tax: ${(totalPrice * .07).toFixed(2)}</div>
          <div></div>
          <div>Total Price: ${(totalPrice + (totalPrice * .07) + 3).toFixed(2)}</div>
            <p>A confirmation email has been sent to your email address</p>
            <button className="btn btn-primary"onClick={backToHome}>Back to Home</button>
        
        </div>

      </div>
    </div>

  );
}

export default OrderConfirmation;
