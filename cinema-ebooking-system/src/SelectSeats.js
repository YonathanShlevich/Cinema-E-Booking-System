import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SelectSeats.css';

function SelectSeats() {

    const navigate = useNavigate();

    const handleConfirmSeats = (e) => {
        e.preventDefault();
        //update chosen seats
        navigate("/bookticket");
    }
  // Define seats array with initial state
  const [seats, setSeats] = useState(generateSeats());

  // Function to generate seats
  function generateSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 8;
    let seatId = 1;
    let generatedSeats = [];

    for (let row of rows) {
      for (let i = 1; i <= seatsPerRow; i++) {
        generatedSeats.push({
          id: seatId++,
          name: `${row}${i}`,
          selected: false
        });
      }
    }

    return generatedSeats;
  }

  // Function to handle seat selection
  const handleSeatClick = (seatId) => {
    // Update the state to toggle seat selection status
    setSeats(seats.map(seat =>
      seat.id === seatId ? { ...seat, selected: !seat.selected } : seat
    ));
  };

  return (
    <div className='selectSeats'>
      <h2>---- Screen ----</h2>
      <div className="seat-container">
        {/* Map over seats array to render each seat */}
        {seats.map(seat => (
          <div
            key={seat.id}
            className={`seat ${seat.selected ? 'selected' : ''}`}
            onClick={() => handleSeatClick(seat.id)}
          >
            {seat.name}
          </div>
        ))}
      </div>
      <p className='warning'>Red seats have already been booked</p>
      <button className='btn btn-primary' onClick={handleConfirmSeats}>Confirm Selection</button>
      
    </div>
    
  );
}

export default SelectSeats;
