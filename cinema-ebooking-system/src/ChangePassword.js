import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ChangePassword() {

    const navigate = useNavigate();

    //When clicking submit, this will be used to determine if the passwords can be changed or not
    //this is done by checking to make sure all the fields are filled in and new password = confirmpassword
    const handleSubmit = (e) => {
        
        e.preventDefault();
    
        //Getting the references from the input field of the form
        let oldpassword = document.getElementById("oldpassword");
        let newpassword = document.getElementById("newpassword");
        let confirmpassword = document.getElementById("confirmPass");
        if (oldpassword.value === "" || newpassword.value === "" || confirmpassword.value === "") {
            window.alert("Please fill in all fields.");
        } else if (newpassword.value !== confirmpassword.value) {
            window.alert("Passwords do not match.");
        } else {

            window.alert("Password changed successfully.");
            navigate('/login');
        }

    }
  
  //Where the forms and input fields are created
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