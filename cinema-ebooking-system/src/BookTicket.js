import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './BookTicket.css';
import axios from "axios";

function BookTicket() {

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedShowtimes, setSelectedShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState("");
  const [seats, setSeats] = useState([]);

  const [movieFromURL, setMovieFromURL] = useState("");
  const [showtimeFromURL, setShowtimeFromURL] = useState("");
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  

  useEffect(() => {
    // Clear seats when the selected movie changes
    setSeats([]);
  }, [selectedMovieId]); // Dependency on selectedMovieId, selectedShowtime

  useEffect(() => {
    // Clear seats when the selected movie changes
    setSelectedShowtime("");
    setShowtimeFromURL("");
  }, [selectedMovieId]); // Dependency on selectedMovieId

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
      setSelectedMovieId(movieTitle); // Set selected movie from URL
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
      setSelectedShowtime(showtime);
      axios.get(`http://localhost:4000/showtime/pullShowtimeFromID/${showtime}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
          console.log(response.data.message)
        } else {

          setShowtimeFromURL(response.data)
          console.log("set the selected showtime")
          console.log(response.data)
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
      setSeats(selectedSeats);
    }
  }, [location.search]);
  

  useEffect(() => {
    axios.get(`http://localhost:4000/movie/allMovies`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setMovies(response.data)
        }
      })
      .catch(error => { 
        console.error('Error fetching user info:', error);
      });
  }, []);



  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/showtime/allShowtimes`);
        if (response.data.status === "FAILED") {
          // handle error if needed
          return;
        }
        
        const updatedShowTimes = await Promise.all(response.data.map(async showtime => {
          try {
            const periodResponse = await axios.get(`http://localhost:4000/Showtime/pullShowPeriodfromId/${showtime.period}`);
            if (periodResponse.data.status !== "FAILED") {
              return {
                ...showtime,
                period: periodResponse.data.time
              };
            } else {
              // Handle error if needed
              console.error(`Error fetching period for showtime ID ${showtime._id}`);
              return showtime;
            }
          } catch (error) {
            console.error('Error fetching period info:', error);
            return showtime;
          }
        }));
  
        setShowTimes(updatedShowTimes);
        handleMovieChange({ target: { value: selectedMovieId } });
        console.log("Showtimes:", updatedShowTimes); // Check the contents of showTimes

      } catch (error) {
        console.error('Error fetching showTime info:', error);
      }
    };
  
    fetchShowTimes();
  }, []);
  

  const handleMovieChange = (e) => {
    const selectedMovieId = e.target.value;
    setSelectedMovieId(selectedMovieId);

    const selectedMovie = movies.find(movie => movie._id === selectedMovieId);

    if (selectedMovie) {
        setMovieFromURL(selectedMovie.title);
    }

    const filteredShowtimes = showTimes.filter(showtime => showtime.movie === selectedMovieId);
    setSelectedShowtimes(filteredShowtimes);
};


  const handleShowtimeChange = (e) => {
    setSelectedShowtime(e.target.value);
    
  };

  const handleAgeChange = (seatNumber, selectedValue) => {
    // Update the state to reflect the new age for the selected seat
    setSeats(prevSeats => {
        // Find the index of the seat with the matching seat number
        const seatIndex = prevSeats.findIndex(seat => seat.seatNumber === seatNumber);
        
        // If the seat is found, update its age property
        if (seatIndex !== -1) {
            const updatedSeats = [...prevSeats]; // Create a copy of the seats array
            updatedSeats[seatIndex] = {
                ...updatedSeats[seatIndex],
                age: selectedValue
            };
            return updatedSeats; // Return the updated seats array
        }
        
        // If the seat is not found, return the previous state without making any changes
        return prevSeats;
    });
};

  

  

  const handleSubmit = (e) => {
    e.preventDefault();
    //do stuff to save data
    navigate(`/bookticket/order-summary?movieTitle=${movieFromURL}&showtime=${encodeURIComponent(selectedShowtime)}&seats=${encodeURIComponent(JSON.stringify(seats))}`);
  }

  const handleSeats = (e) => {
    e.preventDefault();
    navigate(`/bookticket/select-seats?movieTitle=${movieFromURL}&showtime=${encodeURIComponent(selectedShowtime)}`);
  }
  useEffect(() => {
    // Call handleMovieChange function when component mounts
    handleMovieChange({ target: { value: selectedMovieId } });
  }, []); // Empty dependency array means this effect runs only once after initial render

 
  

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
              <select className='form-control' id="title" onChange={handleMovieChange} >
                
              <option value="" disabled selected>{movieFromURL && movieFromURL}</option>
                {movies
                .filter(movie => (
                  movie.category === "Now Showing"
                ))
                .map(movie => (
                  
                  <option  key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Showtime:</label>
              <select className='form-control' id="showtime" value={selectedShowtime} onChange={handleShowtimeChange}>
                <option value="" disabled selected>{showtimeFromURL.date && showtimeFromURL.date.substring(0,10)} {showtimeFromURL && (showtimeFromURL.period ? showtimeFromURL.period.time : showtimeFromURL.period)} </option>
                {selectedShowtimes && selectedShowtimes
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(showtime => (
                  <option key={showtime._id} value={showtime._id}>{showtime.date.substring(0, 10)} {showtime.period}</option>
                ))}
              </select>
            </div>
            {selectedShowtime && 
              <button className='btn btn-primary' onClick={handleSeats}>Select Seats</button>
            }
            
            <div className="form-group">
              <label>{seats.length > 0 ? `Selected Seats:` : ""}</label>
              <ul>
                {seats.map(seat => (
                  <li key={seat.id}>
                    {seat.seatNumber}
                    <div className="form-group">
                      <select className='form-control' id={seat.id} onChange={(e) => handleAgeChange(seat.seatNumber, e.target.value)} >
                        <option value={seat.age} selected>{seat.age}</option>
                        <option value="Adult">Adult</option>
                        <option value="Child">Child</option>
                        <option value="Senior">Senior</option>
                      </select>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {seats.length !== 0 && seats.every(seat => seat.age !== "") && (
              <button className="btn btn-primary" onClick={handleSubmit}>Continue</button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}

export default BookTicket;
