import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ManageUsers.css'; // Import CSS file for styling

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch users from the backend API
    axios.get('http://localhost:4000/user/allUsers')
      .then(response => {
        setUsers(response.data); // Set the users state with the data from the API response
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Function to handle user selection
  const handleUserClick = (user) => {
    // Toggle selection
    setSelectedUser(prevSelectedUser => (
      prevSelectedUser === user ? null : user
    ));
  };

  return (
    <div className="manage-users-container">
      <Link to="/admin" className="backbutton">Back</Link>
      <div className="user-card">
        <div className="user-card-header">
          <h2>Manage Users</h2>
        </div>
        <div className="user-card-body">
          <table className="user-table">
            <thead>
              <tr>
                <th className="id-column">ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} onClick={() => handleUserClick(user)} className={selectedUser === user ? 'selected' : ''}>
                  <td className="id-column">{user._id}</td>
                  <td>{user.firstName + " " + user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.type}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedUser && (
        <Link to={`/admin/manage-users/editprofile/${selectedUser._id}`} className="edit-button">Edit Profile</Link>
      )}
      <div className="button-space"></div>
      {selectedUser && (
        <Link to={`/admin/manage-users/editstatustype/${selectedUser._id}`} className="edit-button">Edit Status & Type</Link>
      )}
    </div>
  );
}

export default ManageUsers;
