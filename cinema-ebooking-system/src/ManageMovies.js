import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function ManageMovies() {
  return (

    <div>
      <Link to="/admin" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Manage Movies</h2>
        </div>
        <div className="card-body">
        <Link to="/admin/manage-movies/manage-existing-movies" className="mainButton">Manage Existing Movies</Link>
        <Link to="/admin/manage-movies/add-showtime" className="mainButton">+ Add Showtime</Link>
        <Link to="/admin/manage-movies/add-movie" className="mainButton">+ Add Movie</Link>

        </div>

      </div>
    </div>

  );
}

export default ManageMovies;
