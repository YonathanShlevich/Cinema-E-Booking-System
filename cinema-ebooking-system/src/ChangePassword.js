import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ChangePassword() {

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        
        e.preventDefault();
    
        let oldpassword = document.getElementById("oldpassword");
        let newpassword = document.getElementById("newpassword");
        let confirmpassword = document.getElementById("confirmPass");
        if (oldpassword.value === "" || newpassword.value === "" || confirmpassword.value === "") {
            window.alert("Please fill in all fields.");
        } else if (newpassword !== confirmpassword) {
            window.alert("Passwords do not match.");
        } else {

            window.alert("Password changed successfully.");
            navigate('/login');
        }

    }

  return (

    <div>
      <Link to="/viewprofile" className="backbutton"> Back to Profile</Link>
      <div className="card">
        <div className="card-header">
          <h2>Change Password</h2>
        </div>
        <div className="card-body">
          <form action="" id="signUpForm" onSubmit={handleSubmit}>
          <div className="form-group">
              <label>Old Password:</label>
              <input id="oldpassword" type="password" className="form-control" />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input id="newpassword" type="password" className="form-control" />
            </div>
            <div className="form-group">
              <label>Confirm New Password:</label>
              <input id="confirmPass" type="password" className="form-control" />
            </div>        
            <button type="submit" className="btn btn-primary">Change Password</button>
          </form>
          
        </div>
      </div>
    </div>

  );
}

export default ChangePassword;