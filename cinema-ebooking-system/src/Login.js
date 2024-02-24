import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {

  const navigate = useNavigate();

    const handleSubmit = (e) => {
        
        e.preventDefault();
    
        let password = document.getElementById("password");
        let email = document.getElementById("email");

        if (email.value === "" || password.value === "") {
          window.alert("Ensure email and password are input");
        } else { // all is good
            // submit to database
            navigate('/');
            
        }

    }
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
