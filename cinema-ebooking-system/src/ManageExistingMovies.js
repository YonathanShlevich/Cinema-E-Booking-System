import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function ManageExistingMovies() {
    const navigate = useNavigate();

    const handleUpdate = (e) => {
        e.preventDefault();
        const title = document.getElementById("title");

        if (title.value === "") {
            window.alert("You must select a movie to update")
        } else {
            // somehow fill the add movie page with the information from the database based on the movie title selected
            navigate("/admin/manage-movies/add-movie");
        }
        

    }
    const handleDelete = (e) => {
        e.preventDefault();
        const title = document.getElementById("title");
        if (title.value === "") {
            window.alert("You must select a movie to delete")
        } else {
            //delete movie
            navigate("/admin/manage-movies");
        }

        

    }

  return (

    <div>
      <Link to="/admin/manage-movies" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Manage Existing Movies</h2>
        </div>
        <div className="card-body">
            <form id="manageExistingMoviesForm" onSubmit={handleDelete}>
            <div className="form-group">
              <label>Select Movie:</label>
              <select id="title" className="form-control">
                <option value="" selected></option>
                <option value="Ready Player One">Ready Player One</option>
                <option value="National Treasure">National Treasure</option>
                <option value="The Adventures of Tintin">The Adventures of Tintin</option>
                </select>
            </div>
            <button className="mainButton" type="submit">Delete</button>
            
            </form>
        <button className="mainButton" type="submit" onClick={handleUpdate}>Update</button>
        </div>

      </div>
    </div>

  );
}

export default ManageExistingMovies;
