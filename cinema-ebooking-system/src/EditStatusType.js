import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditStatusType() {
  const [userInfo, setUserInfo] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:4000/user/data/${userId}`)
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error
        } else {
          setUserInfo(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [userId]);

  const handleSubmitEditStatusType = async (e) => {
    e.preventDefault();

    const type = parseInt(document.getElementById("type").value);
    const status = parseInt(document.getElementById("status").value);

    const formData = {
      type: type,
      status: status
    };

    try {
      const response = await axios.post(`http://localhost:4000/user/editTypeStatus/${userId}`, formData);
      
      if (response.data.status === "FAILED") {
        window.alert(response.data.message);
      } else {
        window.alert("Profile updated successfully.");
        navigate("/admin/manage-users");
      }
    } catch (error) {
      console.error('Edit profile error', error);
      window.alert(error);
    }
  };

  const handleDeleteUser = async () => {

    // Ask for confirmation before deleting user
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) return; // If not confirmed, do nothing

    try {
      const response = await axios.post(`http://localhost:4000/user/deleteUser/${userInfo.email}`);

      
      if (response.data.status === "FAILED") {
        window.alert(response.data.message);
      } else {
        window.alert("User deleted successfully.");
        navigate("/admin/manage-users");
      }
    } catch (error) {
      console.error('Delete user error', error);
      window.alert(error);
    }
  };

  return (
    <div>
      <Link to="/admin/manage-users" className="backbutton"> Back to Manage User</Link>
      <div className="card">
        <div className="card-header">
          <h2>Edit Status & Type</h2>
        </div>
        {userInfo && (
          <div className="card-body">
            <form id="signUpForm" onSubmit={handleSubmitEditStatusType}>
              <div className="form-group">
                <label>* User Type:</label>
                <input type="number" className="form-control" id="type" placeholder={userInfo.type} min={1} max={2} required />
              </div>
              <div className="form-group">
                <label>* User Status:</label>
                <input type="number" className="form-control" id="status" placeholder={userInfo.status} min={1} max={3} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginRight: '8px' }}>Submit</button>
              <button type="button" onClick={handleDeleteUser} className="btn btn-danger">Delete User</button>
              <div className="button-space"></div>
              <label>User Type: 1 - User, 2 - Admin</label>
              <label>User Status: 1 - Active, 2 - Inactive, 3 - Suspended</label>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditStatusType;
