import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './HomeLoggedIn.css';

const Home = () => {

  const [isOpen, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const nowShowingMovies = [
    { id: 1, title: 'Ready Player One', poster: '/rp1.jpg', trailerId: 'cSp1dM2Vj48' },
    { id: 2, title: 'Rush Hour', poster: '/rush hour poster.jpg', trailerId: 'JMiFsFQcFLE' },
  ];

  const comingSoonMovies = [
    { id: 3, title: 'Morbius', poster: '/morb.jpg', trailerId: 'oZ6iiRrz1SY' },
    { id: 4, title: 'The Bee Movie', poster: '/beemovie.webp', trailerId: 'sxuU39hMpP4' },
  ];

  const playTrailer = (trailerId) => {
    setSelectedMovie(trailerId);
    setOpen(true);
  };

  const closeTrailer = () => {
    setSelectedMovie(null);
    setOpen(false);
  };

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
        <input type="text" id="searchbar" placeholder="Search for movies..." />
        <button> +Filter </button>
        <button id='btnbook'> <Link to='/bookticket'>Book Ticket</Link></button>
      </nav>
  
      <h1>Now Showing</h1>
      <div className="movie-gallery">
        {nowShowingMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
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
        ))}
      </div>
  
      <h1>Coming Soon</h1>
      <div className="movie-gallery">
        {comingSoonMovies.map((movie) => (
          <div key={movie.id} className="movie-item">
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
        ))}
      </div>
  
    </div>
  );
};

export default Home;
