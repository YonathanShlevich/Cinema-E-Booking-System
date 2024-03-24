import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Home.css';

// Constructor for the movie class
class Movie {
  constructor(title, poster, trailerId, status) {
    this.title = title;
    this.poster = poster;
    this.trailerId = trailerId;
    this.status = status;
  }
}

const Home = () => {
  // State variables
  const [isOpen, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    //Function to get user ID from localStorage
    const getLoggedInUserId = () => {
     return localStorage.getItem('loggedInUserId');
    };

    //Set the initial value for loggedInUserId when the component mounts
    setLoggedInUserId(getLoggedInUserId());
  }, []);

  // Function to clear user ID from localStorage (logout)
  const clearLoggedInUserId = () => {
    localStorage.removeItem('loggedInUserId');
  };

  const handleLogout = () => {
    clearLoggedInUserId();
  };

  // Fetching movies from JSON file on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      // Fetching JSON data from the file
      const jsonData = require('./controllers/response.json');
      // Mapping JSON data to Movie objects
      const movieData = jsonData.map(movieArray => {
        const title = movieArray[0];
        const status = movieArray[7];
        const trailerID = movieArray[3];
        const poster = movieArray[8];
        return new Movie(title, poster ,trailerID, status);
      });
      // Setting movies state
      setMovies(movieData);
    };
    fetchMovies();
  }, []);

  // Function to play trailer
  const playTrailer = (trailerId) => {
    setSelectedMovie(trailerId);
    setOpen(true);
  };

  // Function to close trailer
  const closeTrailer = () => {
    setSelectedMovie(null);
    setOpen(false);
  };

  // Function to handle search input change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter movies based on search term
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      <nav>
        {/* This is where the navbar and the elements inside is located */}
        {loggedInUserId ? (
          // If user is logged in, display account-related buttons
          <>
            <button className="dropbtn">Account</button>
            <div>
              <Link to="/viewprofile">View Profile</Link>
              <Link to="/" onClick={handleLogout}>Logout</Link>
            </div>
          </>
        ) : (
          // If user is not logged in, display login/signup button
          <button id="btnlogin"> <Link to="/login"> Login/Sign Up </Link></button>
        )}
        {/* Search bar */}
        <input
          type="text"
          id="searchbarloggedin"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button> +Filter </button>
        {loggedInUserId && (
          <button id='btnbook'> <Link to='/bookticket'>Book Ticket</Link></button>
        )}
      </nav>

      {/* Section for Now Showing movies */}
      <h1>Now Showing</h1>
      <div className="movie-gallery">
        {/* Mapping through filteredMovies array to display Now Showing movies, 
        this should show all of them since the filter has nothing */}
        {filteredMovies.map((movie, index) => (
          movie.status === 'nowShowing' && (
            <div key={index + 1} className="movie-item">
              {isOpen && selectedMovie === movie.trailerId ? (
                // If trailer is open, show iframe where the trailer can be played
                <>
                  <iframe
                    title={movie.title}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${movie.trailerId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onClick={(e) => e.stopPropagation()} // Prevent click propagation to close the trailer
                  />
                  <div className="modal">
                    <button onClick={closeTrailer}>Close</button>
                  </div>
                </>
              ) : (
                // If trailer is closed, show movie poster
                <>
                  <img src={movie.poster} alt={movie.title} onClick={() => playTrailer(movie.trailerId)} />
                  <h3>{movie.title}</h3>
                </>
              )}
            </div>
          )
        ))}
      </div>

      {/* Section for Coming Soon movies */}
      <h1>Coming Soon</h1>
      <div className="movie-gallery">
        {/* Mapping through filteredMovies array to display Coming Soon movies, 
        this should show all of them since the filter has nothing */}
        {filteredMovies.map((movie, index) => (
          movie.status === 'comingSoon' && (
            <div key={index+1} className="movie-item">
              {isOpen && selectedMovie === movie.trailerId ? (
                // If trailer is open, show iframe where the trailer can be played
                <>
                  <iframe
                    title={movie.title}
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${movie.trailerId}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onClick={(e) => e.stopPropagation()} // Prevent click propagation to close the trailer
                  />
                  <div className="modal">
                    <button onClick={closeTrailer}>Close</button>
                  </div>
                </>
              ) : (
                // If trailer is closed, show movie poster
                <>
                  <img src={movie.poster} alt={movie.title} onClick={() => playTrailer(movie.trailerId)} />
                  <h3>{movie.title}</h3>
                </>
              )}
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Home;
