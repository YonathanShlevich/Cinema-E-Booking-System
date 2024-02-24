import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  return (

    <div>
      <Link to="/" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Admin Home</h2>
        </div>
        <div className="card-body">
        <Link to="/" className="backbutton">Manage Movies</Link>
       
        </div>
        <div className="card-body">
        <Link to="/" className="manageMovies">Manage Movies</Link>

        </div>
        <div className="card-body">
        <Link to="/" className="manageMovies">Manage Movies</Link>

        </div>

      </div>
    </div>

  );
}

export default Admin;
