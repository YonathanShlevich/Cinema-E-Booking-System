import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function EditStatusType() {

    const [userInfo, setUserInfo] = useState(null); //Used for User's info
    
    const { userId } = useParams();

    //Pulling data from our backend using a Use Effect block: User
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/${userId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setUserInfo(response.data); //Set user info to the response data
        }
        
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [userId]);

    const navigate = useNavigate();

    //Handling submission
    const handleSubmitEditStatusType = async (e) => {
        
        e.preventDefault();
    
        let type = document.getElementById("type") ? document.getElementById("type").value : undefined;
        let status = document.getElementById("status") ? document.getElementById("status").value : undefined;
        
          const formData = {

            type: type,
            status: status

          };
          try {
            // Make POST request to edit profile endpoint
            const response = await axios.post(`http://localhost:4000/user/editProfile/${userId}`, formData);
            
            // Handle successful signup
            if (response.data.status === "FAILED") {
              // error
              window.alert(response.data.message);
              
              
            } else {
              window.alert("Profile updated successfully.");
              navigate("/admin/manage-users");
              
            }
        } catch (error) {
            // Handle signup error
            console.error('Edit profile error', error);
            // Display error message to the user
            window.alert(error);
        }        

    }

  //Form for editing the status & type of the user
  return (

    <div>
      <Link to="/admin/manage-users" className="backbutton"> Back to Manage User</Link>
      <div className="card">
        <div className="card-header">
          <h2>Edit Status & Type</h2>
        </div>
        {userInfo && (
          <div className="card-body">
          <form action="" id="signUpForm" onSubmit={handleSubmitEditStatusType}>
            <div className="form-group">
              <label>* User Type:</label>
              <input type="text" className="form-control" id="type" placeholder={userInfo.type}/>
            </div>
            <div className="form-group">
              <label>* User Status:</label>
              <input type="text" className="form-control" id="status" placeholder={userInfo.status}/>
            </div>
        
            <button type="submit" className="btn btn-primary">Submit</button>
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