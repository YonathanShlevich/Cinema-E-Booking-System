import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from "react-router-dom";
import './Home.css';
import axios from "axios";

// Constructor for the movie class
/*
class Movie {
  constructor(title, poster, trailerId, status) {
    this.title = title;
    this.poster = poster;
    this.trailerId = trailerId;
    this.status = status;
  }
}
*/

const Home = () => {
  const navigate = useNavigate();
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
    setLoggedInUserId(null);
  };

  const handleLogout = () => {
    clearLoggedInUserId();
    window.location.href = '/';
  };

  /*
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
*/

  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/movie/allMovies`) //Calls our data backend GET call
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




  // Function to open pop up
  const openInfo = (movie) => {
    
    
    const popupContent = `
        <div>
            <h2>${movie.title}</h2>
            <p><strong>Category:</strong> ${movie.category}</p>
            <p><strong>Cast:</strong> ${movie.cast.join(", ")}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Director:</strong> ${movie.director}</p>
            <p><strong>Producer:</strong> ${movie.producer}</p>
            <p><strong>Synopsis:</strong> ${movie.synopsis}</p>
            <p><strong>Film Rating:</strong> ${movie.filmRating}</p>
            <img src="${movie.trailerPictureLink}" alt="Movie Poster" style="max-width: 300px;">
        </div>
    `;
    
    const modal = document.getElementById("myModal");
    const popupContentContainer = document.getElementById("popupContent");
    popupContentContainer.innerHTML = popupContent;
    
    modal.style.display = "block"; // Show the modal

    // Close the modal when the close button is clicked
    const closeButton = document.getElementsByClassName("close")[0];
    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    // Prevent clicks outside the modal from closing it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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
      <div className="dropdown">
          <button className="dropbtn">Account</button>
          <div className="dropdown-content">
            <Link to="/viewprofile">View Profile</Link>
            <Link to="/" onClick={handleLogout}>Logout</Link>
         </div>
        </div>
          </>
        ) : (
          // If user is not logged in, display login/signup button
          <button id="btnlogin" onClick={() => navigate("/login")}>  Login/Sign Up </button>
        )}
        {/* Search bar */}
        <input
          type="text"
          id="searchbar"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button> +Filter </button>
        {loggedInUserId && (
          <button id='btnbook' onClick={() => navigate("/bookticket")}>Book Ticket</button>
        )}
      </nav>

      <div id="myModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div id="popupContent"></div>
      </div>
      </div>

      {/* Section for Now Showing movies */}
      <h1>Now Showing</h1>
      <div className="movie-gallery">
        {/* Mapping through filteredMovies array to display Now Showing movies, 
        this should show all of them since the filter has nothing */}
        {filteredMovies.map((movie, index) => (
          movie.category === 'Now Showing' && (
            <div key={movie._id} className="movie-item">
              
                <>
                  <img src={movie.trailerPictureLink} alt={movie.title} onClick={() => openInfo(movie)} />
                  <h3>{movie.title}</h3>
                </>
              
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
          movie.category === 'Coming Soon' && (
            <div key={movie._id} className="movie-item">
              
                <>
                  <img src={movie.trailerPictureLink} alt={movie.title} onClick={() => openInfo(movie)} />
                  <h3>{movie.title}</h3>
                </>
              
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Home;
