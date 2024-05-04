import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import axios from "axios";

function ManageExistingMovies() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");

  useEffect(() => {
    // Fetch movies from the backend API
    axios.get('http://localhost:4000/movie/allMovies')
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error if needed
        } else {
          // Set the movies state with the data from the API response
          setMovies(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  const navigate = useNavigate();

  const handleUpdate = (e) => {
    e.preventDefault();
    if (selectedMovie === "") {
      window.alert("You must select a movie to update")
    } else {
      // Redirect to the update page with the selected movie title
      navigate(`/admin/manage-movies/manage-existing-movies/updatemovie/${selectedMovie}`);
    }
  }

  const handleDelete = (e) => {
    e.preventDefault();
    if (selectedMovie === "") {
      window.alert("You must select a movie to delete")
    } else {
      // Delete the selected movie
      axios.post(`http://localhost:4000/movie/deleteMovie/${selectedMovie}`)
        .then(response => {
          // Handle success or error response
          window.location.reload();
        })
        .catch(error => {
          console.error('Error deleting movie:', error);
        });
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
          <form id="manageExistingMoviesForm">
            <div className="form-group">
              <label>Select Movie:</label>
              <select
                id="title"
                className="form-control"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
              >
                <option value="" disabled>Select a movie</option>
                {movies.map(movie => (
                  <option key={movie.id} value={movie.title}>{movie.title}</option>
                ))}
              </select>
            </div>
            <button className="mainButton" type="submit" onClick={handleDelete}>Delete</button>
            <button className="mainButton" type="button" onClick={handleUpdate}>Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageExistingMovies;
