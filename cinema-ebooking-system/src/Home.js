import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './Home.css';

class Movie {
  constructor(title, poster, trailerId, status) {
    this.title = title;
    this.poster = poster;
    this.trailerId = trailerId;
    this.status = status;
  }
}

const Home = () => {
  const [isOpen, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {

      const jsonData = require('./controllers/response.json');
      const movieData = jsonData.map(movieArray => {

        const title = movieArray[0];
        const status = movieArray[7];
        const trailerID = movieArray[3];
        const poster = "/beemovie.webp";
        return new Movie(title, poster ,trailerID, status);

      })

      //placeholder to check if setmovies and fetchmovies work
      //const data = [
       // { title: 'Ready Player One', poster: '/rp1.jpg', trailerId: 'cSp1dM2Vj48', status: 'nowShowing' },
       // { title: 'Rush Hour', poster: '/rush hour poster.jpg', trailerId: 'JMiFsFQcFLE', status: 'nowShowing' },
       // { title: 'Morbius', poster: '/morb.jpg', trailerId: 'oZ6iiRrz1SY', status: 'comingSoon' },
       // { title: 'The Bee Movie', poster: '/beemovie.webp', trailerId: 'sxuU39hMpP4', status: 'comingSoon' },
      //];

      //const moviesData = jsonData.map((movie) => new Movie(movie.title));
      setMovies(movieData);
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
        <button id="btnlogin"> <Link to="/login"> Login/Sign Up </Link></button>
        <input
          type="text"
          id="searchbar"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button> +Filter </button>
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

export default Home;
