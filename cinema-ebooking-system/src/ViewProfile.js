import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ViewProfile() {
    
  return (
    <div>
    <Link to="/" className="backbutton"> Back to Home</Link>
    <Link to="/" className="logoutbutton">Logout</Link>
      <h2>User Profile</h2>
      <div>
        <strong>Name:</strong> John Doe
      </div>
      <div>
        <strong>Phone Number:</strong> 123-123-1231
      </div>
      <div>
        <strong>Email:</strong> chouses@gmail.com
      </div>
      <div>
        <strong>Home Address:</strong> 123 Sample Drive, GA, 12345
      </div>
    </div>

  );
}

export default ViewProfile;