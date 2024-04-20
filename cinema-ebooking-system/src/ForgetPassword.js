import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgetPassword() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        let email = document.getElementById("email");
        let newPassword = document.getElementById("newPassword");
        let confirmPassword = document.getElementById("confirmPassword");

        // Basic validation
        if (email.value === "" || newPassword.value === "" || confirmPassword.value === "") {
            window.alert("Please fill in all fields.");
        } else if (newPassword.value !== confirmPassword.value) {
            window.alert("Passwords do not match.");
        } else {

            try {
                const tempPassData = {
                    email: document.getElementById("email").value,
                    tempPassword: document.getElementById("tempPassword").value,
                };
                // Make POST request to verify temp password endpoint
                const response = await axios.post(`http://localhost:4000/user/verifyTempPassword`, tempPassData);
                
                // Handle successful change password
                if (response.data.status === "SUCCESS") {
                  // Changes the password if SUCCESSFUL

                  const formData = {
                    email: document.getElementById("email").value,
                    password: document.getElementById("newPassword").value
                 };
    
                try {
                    // Make POST request to forgetpassword endpoint
                    const response = await axios.post(`http://localhost:4000/user/forgetpassword`, formData);
                    
                    // Handle successful change password
                    if (response.data.status === "SUCCESS") {
                      // Redirect user to verification page or any other appropriate page
                      navigate('/');
                      
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
                  
                } else {
                  // Display error message to the user
                  window.alert(response.data.message);
                }
            } catch (error) {
                // Handle signup error
                console.error('Temp password checking failed:', error);
                // Display error message to the user
                window.alert(error);
            }

        }
    }

    const sendPassword = async (e) => {

        let email = document.getElementById("email").value;
        if (email === "") {
            window.alert("Please enter your email.");
        } else {
          try {
            // Make POST request to send temporary password
            const response = await axios.post(`http://localhost:4000/user/sendTempPassword`, { email });
      
            if (response.data.status === "SUCCESS") {
              // Temporary password sent successfully
              window.alert("Temporary password sent to your email.");
            } else {
              // Display error message
              window.alert(response.data.message);
            }
          } catch (error) {
            // Handle error
            console.error('Sending temporary password failed:', error);
            window.alert("Failed to send temporary password. Please try again later.");
          }
        }
      };
      
    

    //Form for forget password
    return (
        <div>
            <Link to="/" className="backbutton"> Back to Home</Link>
            <div className="card">
                <div className="card-header">
                    <h2>Reset Password</h2>
                </div>
                <div className="card-body">
                    <form id="resetPasswordForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email:</label>
                            <input
                                type="email"
                                id = "email"
                                className="form-control"
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={sendPassword}>Send Temporary Password</button>
                        <div className="form-group">
                            <label>Temporary Password:</label>
                            <input
                                type="password"
                                id ="tempPassword"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password:</label>
                            <input
                                type="password"
                                id ="newPassword"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                id = "confirmPassword"
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                    </form>
                    <p>Remember your password? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
