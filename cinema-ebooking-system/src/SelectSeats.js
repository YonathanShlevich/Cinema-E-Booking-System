import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './SelectSeats.css';
import axios from "axios";


function SelectSeats() {

    const navigate = useNavigate();
    const location = useLocation();

    const [seats, setSeats] = useState([]);
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
        //set the seats from the showtime
        axios.get(`http://localhost:4000/showtime/pullShowtimeFromID/${showtime}`)
        .then(response => {
          if (response.data.status === "FAILED") {
            // do nothing
            console.log(response.data.message)
          } else {
            const seats = response.data.seats.map(seat => ({
              ...seat,
              selected: false, // Set the initial value of the "selected" property
              age: "",
              price: 0
            }));
            setSeats(seats)
            
          }
        })
        .catch(error => { 
          console.error('Error fetching showtime info:', error);
        });


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

    useEffect(() => {
      console.log(seats);
      
      
    }, [seats]);
    const handleConfirmSeats = (e) => {
        e.preventDefault();
        //update chosen seats
        navigate(`/bookticket?movieTitle=${movieFromURl}&showtime=${encodeURIComponent(showtime)}&seats=${encodeURIComponent(JSON.stringify(selectedSeats))}`);
    }
  // Define seats array with initial state
  

  

  // Function to handle seat selection
  const handleSeatClick = (seatId) => {
    // Update the state to toggle seat selection status
    const updatedSeats = seats.map(seat =>
      seat.seatNumber === seatId ? { ...seat, selected: !seat.selected } : seat
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
            key={seat.seatNumber}
            className={`seat ${seat.status === 'Available' ? (seat.selected ? 'selected-green' : '') : 'unavailable'}`}
            onClick={seat.status === 'Available' ? () => handleSeatClick(seat.seatNumber) : null}
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
