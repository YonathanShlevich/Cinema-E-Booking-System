import { Link, useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {

        e.preventDefault();

        let email = document.getElementById("email");
        let newPassword = document.getElementById("newPassword");
        let confirmPassword = document.getElementById("confirmPassword");

        // Basic validation
        if (email.value === "" || newPassword.value === "" || confirmPassword.value === "") {
            window.alert("Please fill in all fields.");
        } else if (newPassword !== confirmPassword) {
            window.alert("Passwords do not match.");
        } else {

            window.alert("Password changed successfully.");
            navigate('/login');
        }
    }

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
