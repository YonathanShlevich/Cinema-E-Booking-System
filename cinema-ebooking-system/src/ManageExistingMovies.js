import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function ManageExistingMovies() {
  return (

    <div>
      <Link to="/admin/manage-movies" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Manage Existing Movies</h2>
        </div>
        <div className="card-body">
        
        </div>

      </div>
    </div>

  );
}

export default ManageExistingMovies;
