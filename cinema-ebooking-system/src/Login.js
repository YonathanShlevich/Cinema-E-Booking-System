import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  return (

    <div>
      <Link to="/" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>Email:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" className="form-control" />
            </div>
            <Link to="/">
              <button type="submit" className="btn btn-primary">Login</button>
            </Link>
          </form>
          <p>New user? <Link to="/signup">Signup</Link></p>
          <p>Forgot Password? <Link to="/forgotpassword">Forgot Password</Link></p>
        </div>
      </div>
    </div>

  );
}

export default Login;
