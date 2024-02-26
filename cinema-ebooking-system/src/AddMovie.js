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

        let reviews = document.getElementById("reviews");
        let trailer = document.getElementById("trailer");
        let rating = document.getElementById("rating");
        let category = document.getElementById("category");
        let showDatesAndTimes = document.getElementById("showDatesAndTimes");
       

     
        if (title.value === "" || cast.value === "" || producer.value === "" 
            || director.value === "" || syn.value === "" || reviews.value === "" || trailer.value === "" 
            || rating.value === "" || category.value === "" || showDatesAndTimes.value === "") {
          window.alert("Ensure you input a value in all fields marked *");
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
                <label>*Cast:</label>
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
                <label>*Reviews:</label>
                <input id="reviews" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Trailer:</label>
                <input id="trailer" type="text" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Rating:</label>
                    <select id="rating" className="form-control">
                        <option value="" selected></option>
                        <option value="Horror">R</option>
                        <option value="Drama">PG-13</option>
                        <option value="Action">PG</option>
                        <option value="Comedy">G</option>
                        
                    </select>
                </div>
                <div className="form-group">
                <label>*Category:</label>
                    <select id="category" className="form-control">
                        <option value="" selected></option>
                        <option value="Horror">Horror</option>
                        <option value="Drama">Drama</option>
                        <option value="Action">Action</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Romance">Romance</option>
                        <option value="Family">Family</option>
                    </select>
                </div>
                <div className="form-group">
                <label>*Show Dates and Times:</label>
                <input id="showDatesAndTimes" type="datetime-local" className="form-control" />
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
