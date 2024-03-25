import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


function ChangePassword() {
    const userId = localStorage.getItem('loggedInUserId');

    const navigate = useNavigate();

    // Function to clear user ID from localStorage (logout)
    const setLoggedInUserId = (userId) => {
      localStorage.setItem('loggedInUserId', userId);
    };
  const clearLoggedInUserId = () => {
    localStorage.removeItem('loggedInUserId');
    setLoggedInUserId(null);
  };

    //When clicking submit, this will be used to determine if the passwords can be changed or not
    //this is done by checking to make sure all the fields are filled in and new password = confirmpassword
    const handleSubmit = async (e) => {
        
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
          
          
          const formData = {
            oldPassword: document.getElementById("oldpassword").value,
            newPassword: document.getElementById("newpassword").value

          };
          

          try {
            // Make POST request to signin endpoint
            const response = await axios.post(`http://localhost:4000/user/changePassword/${userId}`, formData);
            
            // Handle successful signup
            if (response.data.status === "PENDING") {
              // Redirect user to verification page or any other appropriate page
              clearLoggedInUserId();
              navigate('/verification');
              
            } else {
              // Display error message to the user
              window.alert(response.data.message);
            }
        } catch (error) {
            // Handle signup error
            console.error('Change password failed:', error);
            // Display error message to the user
            window.alert(error);
        }

            // window.alert("Password changed successfully.");
            // navigate('/login');
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