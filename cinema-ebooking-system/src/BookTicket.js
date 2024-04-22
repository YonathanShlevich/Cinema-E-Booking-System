import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation} from 'react-router-dom';
import './BookTicket.css';
import axios from "axios";

function BookTicket() {
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [selectedShowtimes, setSelectedShowtimes] = useState([]);

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
      } catch (error) {
        console.error('Error fetching showTime info:', error);
      }
    };
  
    fetchShowTimes();
  }, []);
  


/*
  useEffect(() => {
    axios.get(`http://localhost:4000/showtime/allShowtimes`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // handle error if needed
        } else {
          console.log(response.data)
          setShowTimes(response.data)
          //console.log(showTimes)
  
          // Iterate over each showtime and update period attribute
          showTimes.forEach(showtime => {
            axios.get(`http://localhost:4000/Showtime/pullShowPeriodfromId/${showtime.period}`)
              .then(periodResponse => {
                if (periodResponse.data.status !== "FAILED") {
                  // Update the period attribute of the corresponding showtime
                  console.log(periodResponse.data.time)
                  console.log(showtime.period)
                  const updatedShowTimes = response.data.map(item => {
                    

                    if (item.period === showtime.period) {
                      console.log("made it here")
                      return {
                        ...item,
                        period: periodResponse.data.time
                      };
                    }
                    return item;
                  });
                  setShowTimes(updatedShowTimes);
                  
                } else {
                  // Handle error if needed
                  console.error(`Error fetching period for showtime ID ${showtime._id}`);
                }
              })
              .catch(error => { 
                console.error('Error fetching period info:', error);
              });
          });
        }
      })
      .catch(error => { 
        console.error('Error fetching showTime info:', error);
      });
  }, []);
  */
  

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
  const location = useLocation();
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
              <select className='form-control' id="title" onChange={handleMovieChange}>
                <option selected value={new URLSearchParams(location.search).get('movieTitle')} ></option>
                {movies
                .filter(movie => (
                  movie.category === "Now Showing"
                ))
                .map(movie => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Showtime:</label>
              <select className='form-control' id="showtime">
                <option value="" selected></option>
                {selectedShowtimes.map(showtime => (
                  <option key={showtime._id} value={showtime._id}>{new Date(showtime.date).toString().substring(0, 15)} {showtime.period}</option>
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
