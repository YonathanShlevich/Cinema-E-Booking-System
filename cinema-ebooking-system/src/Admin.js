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
        <Link to="/admin/manage-movies" className="mainButton">Manage Movies</Link>
        <Link to="/admin/manage-users" className="mainButton">Manage Users</Link>
        <Link to="/admin/manage-promos" className="mainButton">Manage Promos</Link>
        </div>

      </div>
    </div>

  );
}

export default Admin;
