import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function AddMovie() {


    const navigate = useNavigate();

    const handleSubmit = (e) => {
        
        e.preventDefault();

    
        let title = document.getElementById("title");
        let cast = document.getElementById("cast");
        let producer = document.getElementById("producer");
        let director = document.getElementById("director");
        let syn = document.getElementById("syn");
        
        //let reviews = document.getElementById("reviews");
        let image = document.getElementById("image");
        let trailer = document.getElementById("trailer");
        let rating = document.getElementById("rating");
        let genre = document.getElementById("genre");
        let category = document.getElementById("category"); 
        //let showDatesAndTimes = document.getElementById("showDatesAndTimes"); no booking of showtime, only adding movie
       
        //verify that cast is separated by commas, so we can convert it into an array later
        /*
        let isCommaSeparated = true;
        if(cast.value.indexOf(',') === -1) isCommaSeparated =  false;
        console.log(isCommaSeparated);
        let splitValue = cast.value.split(',');
        if(splitValue.length > 1) {
          isCommaSeparated = true;
        }else {
          isCommaSeparated = false;
        }
        */

     
        if (title.value === "" || cast.value === "" || producer.value === "" 
            || director.value === "" || syn.value === "" || trailer.value === "" 
            || rating.value === "" || category.value === "" || genre.value === "" || image.value === "") { // reviews.value === "" || showdatesandtimes.value === "" removed 
          window.alert("Ensure you input a value in all fields marked */try entering cast by commas");
        } else { // all is good
            // submit to database
            navigate('/admin/manage-movies');
            
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
                <label>*Image:</label>
                <input id="image" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Trailer:</label>
                <input id="trailer" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Category</label>
                    <select id="category" className="form-control">
                        <option value="" selected></option>
                        <option value="Now-Showing">Now Showing</option>
                        <option value="Coming-Soon">Coming Soon</option>
                        
                        
                    </select>
                </div>
                <div className="form-group">
                <label>*Genre</label>
                    <select id="genre" className="form-control">
                        <option value="" selected></option>
                        <option value="Horror">Horror</option>
                        <option value="Drama">Drama</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        
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
