import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';


function AddMovie() {


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const formData = {
          title: document.getElementById("title").value,
          category: document.getElementById("category").value,
          cast: document.getElementById("cast").value.split(',').map(item => item.trim()), //Splits by ',', trims the item, then maps it back to cast
          genre: document.getElementById("genre").value,
          director: document.getElementById("director").value,
          producer: document.getElementById("producer").value,
          synopsis: document.getElementById("syn").value,
          trailerVideoLink: document.getElementById("trailer").value,
          trailerPictureLink: document.getElementById("image").value,
          filmRating: document.getElementById("rating").value
        }

        
        //  showDatesAndTimes = document.getElementById("showDatesAndTimes"); no booking of showtime, only adding movie
       
        //verify that cast is separated by commas, so we can convert it into an array later
        /*
          isCommaSeparated = true;
        if(cast.value.indexOf(',') === -1) isCommaSeparated =  false;
        console.log(isCommaSeparated);
          splitValue = cast.value.split(',');
        if(splitValue.length > 1) {
          isCommaSeparated = true;
        }else {
          isCommaSeparated = false;
        }
        */

        
        if(
          formData.title === null || 
          formData.category === "" || 
          (!Array.isArray(formData.cast) || formData.cast.some(item => typeof item !== 'string' || item.trim() === "")) ||   //I couldn't get it work with a simple one, so it checks if cast is empty in 2 ways
          formData.genre === "" ||
          formData.director === "" || 
          formData.producer === "" || 
          formData.synopsis === "" || 
          formData.trailerVideoLink === "" ||
          formData.trailerPictureLink === "" ||
          formData.filmRating === "") { // reviews.value === "" || showdatesandtimes.value === "" removed 
          if(!Array.isArray(formData.cast) || formData.cast.some(item => typeof item !== 'string' || item.trim() === "")){
            window.alert("Cast is incorrectly formatted, rememeber to separate them by commas!");
          }
          window.alert("Ensure you input a value in all fields marked");
        } else { // all is good
            /*
              Post to 'addmovie' and send to database
            */
            try {
              const response = await axios.post("http://localhost:4000/movie/addMovie", formData);

              if (response.data.status === "FAILED"){
                window.alert(response.data.message);
              } else {
                navigate('/admin/manage-movies');
              }
            } catch(error) {
              window.alert(error);
            }
            
        }

    }

  return (

    <div>
      <Link to="/admin/manage-movies" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Add Movie</h2>
        </div>
        <div className="card-body">
            <form id="addMovieForm" onSubmit={handleSubmit}>
                <div className="form-group">
                <label>*Movie Title:</label>
                <input id="title" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Cast(Separated By Commas):</label>
                <input id="cast" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Director:</label>
                <input id="director" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Producer:</label>
                <input id="producer" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Synopsis:</label>
                <input id="syn" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Image Link:</label>
                <input id="image" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Embedded Trailer Link:</label>
                <input id="trailer" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Category</label>
                    <select id="category" className="form-control">
                        <option value="" selected></option>
                        <option value="Now Showing">Now Showing</option>
                        <option value="Coming Soon">Coming Soon</option>
                        
                        
                    </select>
                </div>
                <div className="form-group">
                <label>*Genre</label>
                    <select id="genre" className="form-control">
                        <option value="" selected></option>
                        <option value="Horror">Horror</option>
                        <option value="Exploitation Horror">Exploitation Horror</option>
                        <option value="Drama">Drama</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Sci-fi">Sci-fi</option>
                        <option value="Romance">Romance</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Documentary">Documentary</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Crime">Crime</option>
                        
                    </select>
                </div>
                <div className="form-group">
                <label>*Rating:</label>
                <select id="rating" className="form-control">
                        <option value="" selected></option>
                        <option value="R">R</option>
                        <option value="PG-13">PG-13</option>
                        <option value="PG">PG</option>
                        <option value="G">G</option>
                        
                    </select>
                </div>
                

                <button type="submit" className="btn btn-primary">Submit</button>
                <p>* Required</p>
            </form>
        
        </div>

      </div>
    </div>

  );
}

export default AddMovie;
