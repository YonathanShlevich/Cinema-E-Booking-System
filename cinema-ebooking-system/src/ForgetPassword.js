import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook

function ForgetPassword() {
    const navigate = useNavigate();
    
    // State variables to store email, new password, and confirm password
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (email.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
            window.alert("Please fill in all fields.");
        } else if (newPassword !== confirmPassword) {
            window.alert("Passwords do not match.");
        } else {

            window.alert("Password changed successfully.");
            navigate('/login');
        }
    }

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
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>New Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Confirm New Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
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
