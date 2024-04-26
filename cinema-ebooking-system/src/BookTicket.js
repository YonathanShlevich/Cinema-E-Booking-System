import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './BookTicket.css';
import axios from "axios";

function BookTicket() {

  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedShowtimes, setSelectedShowtimes] = useState([]);
  const [movieFromURl, setMovieFromURL] = useState("");
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  

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
    const filteredShowtimes = showTimes.filter(showtime => showtime.movie === selectedMovieId);
    setSelectedShowtimes(filteredShowtimes);
  };

  const [seats, setSeats] = useState([
    { id: 1, seat: "A1" },
    { id: 2, seat: "A2" },
    { id: 3, seat: "A3" }
  ]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    //do stuff to save data
    navigate('/bookticket/order-summary');
  }

  const handleSeats = (e) => {
    e.preventDefault();
    navigate('/bookticket/select-seats');
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
                
              <option value="" disabled selected>{movieFromURl && movieFromURl}</option>
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
              <select className='form-control' id="showtime">
                <option value="" selected></option>
                {selectedShowtimes && selectedShowtimes
                .sort((a, b) => a.date.localeCompare(b.date))
                .map(showtime => (
                  <option key={showtime._id} value={showtime._id}>{showtime.date.substring(0, 10)} {showtime.period}</option>
                ))}
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
