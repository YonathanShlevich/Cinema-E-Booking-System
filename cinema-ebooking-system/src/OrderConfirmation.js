import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function OrderConfirmation() {

    const [tickets, setTickets] = useState([
        { id: 1, seat: "A1", age: "Child", price: 10 },
        { id: 2, seat: "A2", age: "Adult", price: 12 },
        { id: 3, seat: "A3", age: "Senior", price: 9 }
        // Add more ticket objects as needed
      ]);

      const totalPrice = tickets.reduce((acc, ticket) => acc + ticket.price, 0);

    const navigate = useNavigate();

    const backToHome = () => {
        navigate("/loggedin")
    }
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
