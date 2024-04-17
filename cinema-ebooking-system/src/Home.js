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
    
    
    const popupText = `
        <div>
            <h2>${movie.title} --- ${movie.category}!</h2>
            <button id='popup-button' >Book Tickets to ${movie.title}</button>
            
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
        <button onClick={() => navigate("/filter")}> +Filter </button>
        {loggedInUserId && (
          <button id='btnbook' onClick={() => navigate("/bookticket")}>Book Ticket</button>
        )}
      </nav>

      {/* This is where the carousel elements are located */}
      <Carousel>
        <Carousel.Item>
          <img class ="carousel-img" src="./homelander.gif" alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img class ="carousel-img" src="./theatre.jpg" alt="Second slide" />
          <Carousel.Caption className="carousel-caption1">
            <h1>Book Your Tickets Here!</h1>
            <p>"Grab your popcorn and buckle up, because it's about to get reel!"</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img class ="carousel-img" src="./movielist.png" alt="First slide" />
          <Carousel.Caption className="carousel-caption2">
            <h1>We have cRaZy movies here!</h1>
            <p>Have you heard of "A Serbian Film" to name one? </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>



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
