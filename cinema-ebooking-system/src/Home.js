import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from "react-router-dom";
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  // State variables
  const [isOpen, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [showTimes, setShowTimes] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [loggedInUserType, setLoggedInUserType] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [carouselVisible, setCarouselVisible] = useState(true);
  const [filterClicked, setFilterClicked] = useState(false);

  useEffect(() => {
    //Function to get user ID from localStorage
    const getLoggedInUserId = () => {
     return localStorage.getItem('loggedInUserId');
    };

    //Set the initial value for loggedInUserId when the component mounts
    setLoggedInUserId(getLoggedInUserId());
  }, []);

  useEffect(() => {
    //Function to get user type from localStorage // Fix typo here
    const getLoggedInUserType = () => {
      return localStorage.getItem('loggedInUserType');
    };

    //Set the initial value for loggedInUserType when the component mounts
    setLoggedInUserType(getLoggedInUserType());
  }, []);

  const isAdmin = () => {

    return loggedInUserType === '2'; // Assuming user ID '2' corresponds to admin

  };

  // Function to clear user ID from localStorage (logout)
  const clearLoggedInUserId = () => {
    localStorage.removeItem('loggedInUserId');
    setLoggedInUserId(null);
  };

  // Function to clear user ID from localStorage (logout)
  const clearLoggedInUserType = () => {
    localStorage.removeItem('loggedInUserType');
    setLoggedInUserType(null);
  };

  //setting the carousel to be visible or not when filter is clicked
  const handleFilterClick = () => {
    setCarouselVisible(false); // Hide the carousel
    setFilterClicked(true);
  };

  const handleLogout = () => {
    clearLoggedInUserId();
    clearLoggedInUserType();
    window.location.href = '/';
  };

  const handleAdmin = () => {
    window.location.href = '/admin';
  };
  
  const handleLogoClick = () => {

    window.location.href = '/';
    setCarouselVisible(true);

  };
    // Function to handle genre selection
      const handleGenreSelection = (genre) => {
        setSelectedGenre(genre);
    };

    const genres = [...new Set(movies.map(movie => movie.genre))];


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

  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/showtime/allShowtimes`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setShowTimes(response.data)

        }
      })
      .catch(error => { 
        console.error('Error fetching showTime info:', error);
      });
  }, []);



  // Function to open pop up
  const openInfo = (movie) => {
    setSelectedMovie(movie)
    
    
    const popupText = `
        <div>
            <h2>${movie.title} --- ${movie.category === "Now Showing" ? `<button id='popup-button' >Book Tickets to ${movie.title}</button>` : `${movie.category}!`}</h2>
            <p>${showTimes.filter(showTime => movie._id.includes(showTime.movie)).length > 0 ? `<strong>Showing On: </strong>`: ``}</p>
            
              ${showTimes.filter(showTime =>
                movie._id.includes(showTime.movie)
              ).map((showTime) => (

                `
                  <p>${showTime.movie == movie._id ? `${new Date(showTime.date).toString().substring(0, 15)}` : ``}</p>
                  
                `
              )
            ).join("")}</p>

            
            
            <p><strong>Cast:</strong> ${movie.cast.join(", ")}</p>
            <p></p>
            <p><strong>Director:</strong> ${movie.director}<strong> - Producer:</strong> ${movie.producer}
            <strong> - Genre:</strong> ${movie.genre}<strong> - Film Rating:</strong> ${movie.filmRating}
            </p>
            
            <p><strong>Synopsis:</strong> ${movie.synopsis}</p>
          
        </div>
    `;

    const popupImageAndTrailer = `
        <img src="${movie.trailerPictureLink}" >
        <iframe height="300px" width="600px" src="https://www.youtube.com/embed/${(movie.trailerVideoLink)}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    const popupReviews = `

        <p>${movie.reviews.length > 0 ? `<strong>Reviews: </strong>`: `<strong>No Reviews Yet ...</strong>`}</p>
        <div>
          ${movie.reviews.map((review, index) => (

            `
              <p>"${review}"</p>
              <p> - Anonymous Critic</p>
            `
          )
          ).join("")}
        </div>
        `;
    const modal = document.getElementById("myModal");
    const popupTextContainer = document.getElementById("popupText");
    const popupImageContainer = document.getElementById("popupImage");
    const popupReviewsContainer = document.getElementById("popupReviews");
    popupTextContainer.innerHTML = popupText;
    popupImageContainer.innerHTML = popupImageAndTrailer;
    popupReviewsContainer.innerHTML = popupReviews;

    // Add event listener to the button
    const popupButton = document.getElementById("popup-button");
    if (popupButton != null) {
      popupButton.addEventListener('click', function() {
      
        navigate(`/bookticket?movieTitle=${encodeURIComponent(movie.title)}`);
      
      // Add your booking logic here
    });
    }
    
    
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
    setSelectedGenre(null); // Reset selected genre when searching
  };

  // Filter movies based on search term
  const filteredMovies = movies.filter(movie =>
    (!selectedGenre || movie.genre.toLowerCase() === selectedGenre.toLowerCase()) &&
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
            {isAdmin() && <Link to="/admin" onClick={handleAdmin}>Admin Page</Link>}
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
        <button onClick={handleFilterClick}> +Filter </button>
        {loggedInUserId && (
          <button id='btnbook' onClick={() => navigate("/bookticket")}>Book Ticket</button>
        )}
        <Link to="/" onClick={handleLogoClick}>
          <img class ="sitelogo"  src = "./logo.png" alt = "OnlyFlix logo"/>
        </Link>
        

      </nav>

      {/* This is where the carousel elements are located */}
      {carouselVisible && (
      <Carousel>
        {/* Each Item is one of the slide */}
        <Carousel.Item>
          <img class ="carousel-img" src="./homelander.gif" alt="First slide" />
        </Carousel.Item>
        {/* Second Slide */}
        <Carousel.Item>
          <img class ="carousel-img" src="./theatre.jpg" alt="Second slide" />
          <Carousel.Caption className="carousel-caption1">
            <h1>Book Your Tickets Here!</h1>
            <p>"Grab your popcorn and buckle up, because it's about to get reel!"</p>
          </Carousel.Caption>
          {/* Third Slide */}
        </Carousel.Item>
        <Carousel.Item>
          <img class ="carousel-img" src="./movielist.png" alt="First slide" />
          <Carousel.Caption className="carousel-caption2">
            <h1>We have cRaZy movies here!</h1>
            <p>Have you heard of "A Serbian Film" to name one? </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      )}
      
      {/* Section for Filtering Buttons */}
      {filterClicked && (
      <ul className="genre_filter">
      {/* Map over the genres array to dynamically render buttons */}
        {genres.map((genre, index) => (
        <li key={index}>
          {/* Use genre as the button label */}
          <button 
            className={`genre_click ${selectedGenre === genre ? 'selected' : ''}`} 
            onClick={() => handleGenreSelection(genre)}
          >
            {genre}
          </button>
        </li>
      ))}
    </ul>
      )}


      <div id="myModal" class="modal">
      <div class="modal-content">
        <span class="close">&times;</span>
        <div id="popup-container">
          <div id="popupText"></div>
          <div id="popupImage"></div>
          <div id="popupReviews"></div>
        </div>
      </div>
      </div>

      {/* Section for Now Showing movies */}

      <h1 className='homeHeader'> Now Showing</h1>
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
      <h1 className='homeHeader'>Coming Soon</h1>
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
