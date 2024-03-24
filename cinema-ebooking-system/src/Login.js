import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {

  const navigate = useNavigate();

  // Function to set user ID in localStorage
  const setLoggedInUserId = (userId) => {
    localStorage.setItem('loggedInUserId', userId);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = {
          email: document.getElementById("email").value,
          password: document.getElementById("password").value
          // Add other form fields here
      };
      try {
          // Make POST request to signin endpoint
          const response = await axios.post("http://localhost:5000/user/signin", formData);
          
          // Handle successful signup
          if (response.data.status === "SUCCESS") {
            // Redirect user to verification page or any other appropriate page
            setLoggedInUserId(response.data.data[0]._id);
            navigate('/');
          } else {
            // Display error message to the user
            window.alert(response.data.message);
          }
      } catch (error) {
          // Handle signup error
          console.error('Signin failed:', error);
          // Display error message to the user
          window.alert(error);
      }
  };
  
  return (

    <div>
      <Link to="/" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <div className="card-body">
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input id="email" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input id="password" type="password" className="form-control" />
            </div>
           
              <button type="submit" className="btn btn-primary">Login</button>
         
          </form>
          <p>New user? <Link to="/signup">Signup</Link></p>
          <p>Forgot Password? <Link to="/forgotpassword">Forgot Password</Link></p>
        </div>
      </div>
    </div>

  );
}

export default Login;
