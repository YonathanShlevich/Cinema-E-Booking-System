import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './SelectSeats.css';

function SelectSeats() {

    const navigate = useNavigate();
    const location = useLocation();

    const [seats, setSeats] = useState(generateSeats());
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [movieFromURl, setMovieFromURL] = useState("");


    useEffect(() => {
      const showtimeFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('showtime');
      };
      const showtime = showtimeFromURL();
      if (showtime) {
        setShowtime(showtime)
      }
    }, [location.search]);

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

    const handleConfirmSeats = (e) => {
        e.preventDefault();
        //update chosen seats
        navigate(`/bookticket?movieTitle=${movieFromURl}&showtime=${encodeURIComponent(showtime)}&seats=${encodeURIComponent(JSON.stringify(selectedSeats))}`);
    }
  // Define seats array with initial state
  

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
          seatNumber: `${row}${i}`,
          selected: false
        });
      }
    }

    return generatedSeats;
  }

  // Function to handle seat selection
  const handleSeatClick = (seatId) => {
    // Update the state to toggle seat selection status
    const updatedSeats = seats.map(seat =>
      seat.id === seatId ? { ...seat, selected: !seat.selected } : seat
  );
  setSeats(updatedSeats);

    // Update selectedSeats state based on selected seats
    const newlySelectedSeats = updatedSeats.filter(seat => seat.selected);
    setSelectedSeats(newlySelectedSeats);

    
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
            {seat.seatNumber}
          </div>
        ))}
      </div>
      <p className='warning'>Red seats have already been booked</p>
      <button className='btn btn-primary' onClick={handleConfirmSeats}>Confirm Selection</button>
      
    </div>
    
  );
}

export default SelectSeats;
