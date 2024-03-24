import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BookTicket.css';

function BookTicket() {
    const [seats, setSeats] = useState([
        { id: 1, seat: "A1" },
        { id: 2, seat: "A2" },
        { id: 3, seat: "A3" }
      ]);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        
        e.preventDefault();

        //do stuff to save data

        navigate('/bookticket/order-summary');

    }
    const handleSeats = (e) => {
        e.preventDefault();
        navigate('/bookticket/select-seats');
    }
  return (
    <div>
      <Link to="/" className="backbutton">Cancel</Link>
      <div className="card">
        <div className="card-header">
          <h2>Book Tickets</h2>
        </div>
        <div className="card-body">
          <form id="loginForm">
            <div className="form-group">
              <label>Movie Title:</label>
              <select className='form-control' id="title">
                <option value="" selected></option>
                <option value="0" >Breaking Bad: The Movie</option>
                <option value="1" >Silence of the Lambs</option>
                <option value="2" >Other Movie the Movie</option>
              </select>
            </div>
            <div className="form-group">
              <label>Showtime:</label>
              <select className='form-control' id="showtime">
                <option value="" selected></option>
                <option value="0" >March 14, 10:15 am</option>
              </select>
            </div>
            <button className='btn btn-primary' onClick={handleSeats}>Select Seats</button>
            <div className="form-group">
              <label>Selected Seats:</label>
              <ul>
              {seats.map(seat => (
                <li key={seat.id}>
                  {seat.seat}
                  <div className="form-group">
                    
                        <select className='form-control' id={seat.id} >
                            <option value="" selected></option>
                            <option value="Adult">Adult</option>
                            <option value="Child">Child</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </div>
                </li>
              ))}
            </ul>
            </div>
           
              <button className="btn btn-primary" onClick={handleSubmit}>Continue</button>
         
          </form>
          
        </div>
      </div>
    </div>

  );
}

export default BookTicket;
