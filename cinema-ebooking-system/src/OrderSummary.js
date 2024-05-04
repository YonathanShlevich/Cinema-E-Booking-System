import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function OrderSummary() {
  const [tickets, setTickets] = useState([]);

  const handleDelete = (id) => {
    // Filter out the ticket with the specified ID
    const updatedTickets = tickets.filter(ticket => ticket.id !== id);
    
    // Update the state with the filtered tickets
    setTickets(updatedTickets);
  };

  const navigate = useNavigate();
  const handleUpdate = () => {
    navigate("/bookticket")
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
            <div>Movie Title: Revenant</div>
            <div>Show Time: March 3, 2023, 10:15 AM</div>
          {tickets.map(ticket => (
            <div key={ticket.id}>
              
              <div>{ticket.seat} - - - - ${ticket.price.toFixed(2)} <button onClick={() => handleDelete(ticket.id)}>Delete</button></div>
              
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
