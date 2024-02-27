import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './HomeLoggedIn.css'; // Make sure to import the correct CSS file

class Movie {
  constructor(title, poster, trailerId, status) {
    this.title = title;
    this.poster = poster;
    this.trailerId = trailerId;
    this.status = status;
  }
}

const HomeLoggedIn = () => { // Changed the component name to HomeLoggedIn
  const [isOpen, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      // Placeholder to check if setmovies and fetchmovies work
      const data = [
        { title: 'Ready Player One', poster: '/rp1.jpg', trailerId: 'cSp1dM2Vj48', status: 'nowShowing' },
        { title: 'Rush Hour', poster: '/rush hour poster.jpg', trailerId: 'JMiFsFQcFLE', status: 'nowShowing' },
        { title: 'Morbius', poster: '/morb.jpg', trailerId: 'oZ6iiRrz1SY', status: 'comingSoon' },
        { title: 'The Bee Movie', poster: '/beemovie.webp', trailerId: 'sxuU39hMpP4', status: 'comingSoon' },
      ];

      const moviesData = data.map((movie) => new Movie(movie.title, movie.poster, movie.trailerId, movie.status));
      setMovies(moviesData);
    };
    fetchMovies();
  }, []);

  const playTrailer = (trailerId) => {
    setSelectedMovie(trailerId);
    setOpen(true);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
    setOpen(false);
  };

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
      <div className="dropdown">
        <button className="dropbtn">Account</button>
          <div className="dropdown-content">
            <Link to="/viewprofile">View Profile</Link>
            <Link to="/">Logout</Link>
         </div>
        </div>
        <input
          type="text"
          id="searchbar"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button> +Filter </button>
        <button id='btnbook'> <Link to='/bookticket'>Book Ticket</Link></button>
      </nav>

      <h1>Now Showing</h1>
      <div className="movie-gallery">
        {filteredMovies.map((movie, index) => (
          movie.status === 'nowShowing' && (
            <div key={index + 1} className="movie-item">
              {isOpen && selectedMovie === movie.trailerId ? (
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
                <>
                  <img src={movie.poster} alt={movie.title} onClick={() => playTrailer(movie.trailerId)} />
                  <h3>{movie.title}</h3>
                </>
              )}
            </div>
          )
        ))}
      </div>

      <h1>Coming Soon</h1>
      <div className="movie-gallery">
        {filteredMovies.map((movie, index) => (
          movie.status === 'comingSoon' && (
            <div key={index+1} className="movie-item">
              {isOpen && selectedMovie === movie.trailerId ? (
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

export default HomeLoggedIn;
