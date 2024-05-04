import React, {useState, useEffect} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


function EditProfileAdmin() {

    const [userInfo, setUserInfo] = useState(null); //Used for User's info
    const [homeInfo, setHomeInfo] = useState(null); //Home info
    
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

  //Pulling data from our backend using a Use Effect block: Home Address
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/homeAddr/${userId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setHomeInfo(response.data); //Set user info to the response data
        }
        
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
      });
  }, [userId]);

    const navigate = useNavigate();

    //Handling submission
    const handleSubmitEditProfile = async (e) => {
        
        e.preventDefault();
    
        let firstName = document.getElementById("firstName") ? document.getElementById("firstName").value : undefined;
        let lastName = document.getElementById("lastName") ? document.getElementById("lastName").value : undefined;

        let phoneNum = document.getElementById("tel") ? document.getElementById("tel").value : undefined;
        let homeAddress = document.getElementById("homeAddress") ? document.getElementById("homeAddress").value : undefined;
        let homeCity = document.getElementById("homeCity") ? document.getElementById("homeCity").value : undefined;
        let homeState = document.getElementById("homeState") ? document.getElementById("homeState").value : undefined;
        let homeZip = document.getElementById("homeZip") ? document.getElementById("homeZip").value : undefined;

        let promo = document.getElementById("promoyes").checked;

        
          const formData = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNum,
            homeAddr: homeAddress,
            homeCity: homeCity,
            homeState: homeState,
            homeZip: homeZip,
            promo: userInfo.promo


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

            
            // navigate('/viewprofile');
        

    }

  //Form for editing the profile of the user
  return (

    <div>
      <Link to="/admin/manage-users" className="backbutton"> Back to Manage User</Link>
      <div className="card">
        <div className="card-header">
          <h2>Edit Profile</h2>
        </div>
        {userInfo && (
          <div className="card-body">
          <form action="" id="signUpForm" onSubmit={handleSubmitEditProfile}>
            <div className="form-group">
              <label>* First Name:</label>
              <input type="text" className="form-control" id="firstName" defaultValue={userInfo.firstName}/>
            </div>
            <div className="form-group">
              <label>* Last Name:</label>
              <input type="text" className="form-control" id="lastName" defaultValue={userInfo.lastName}/>
            </div>
            <div className="form-group">
              <label>* Phone Number: (Format: 123-456-7890)</label>
              <input id="tel" type="tel" className="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" defaultValue={userInfo.phoneNumber}/>
            </div>
            {userInfo && (
              <>
              <div  className="form-group">
              <label>Home Address:</label>
              <input id="homeAddress" type="text" className="form-control" defaultValue={homeInfo && homeInfo.homeAddr}/>
            </div>
            <div  className="form-group">
              <label>City:</label>
              <input id="homeCity" type="text" className="form-control" defaultValue={homeInfo && homeInfo.homeCity}/>
            </div>
            <div className="form-group">
              <label>State:</label>
              <select id="homeState" className='form-control' >
                <option value="" disabled selected>{homeInfo && homeInfo.homeState}</option>
                
                <option value="AL">AL</option>
                <option value="AK">AK</option>
                <option value="AZ">AZ</option>
                <option value="AR">AR</option>
                <option value="CA">CA</option>
                <option value="CO">CO</option>
                <option value="CT">CT</option>
                <option value="DE">DE</option>
                <option value="FL">FL</option>
                <option value="GA">GA</option>
                <option value="HI">HI</option>
                <option value="ID">ID</option>
                <option value="IL">IL</option>
                <option value="IN">IN</option>
                <option value="IA">IA</option>
                <option value="KS">KS</option>
                <option value="KY">KY</option>
                <option value="LA">LA</option>
                <option value="ME">ME</option>
                <option value="MD">MD</option>
                <option value="MA">MA</option>
                <option value="MI">MI</option>
                <option value="MN">MN</option>
                <option value="MS">MS</option>
                <option value="MO">MO</option>
                <option value="MT">MT</option>
                <option value="NE">NE</option>
                <option value="NV">NV</option>
                <option value="NH">NH</option>
                <option value="NJ">NJ</option>
                <option value="NM">NM</option>
                <option value="NY">NY</option>
                <option value="NC">NC</option>
                <option value="ND">ND</option>
                <option value="OH">OH</option>
                <option value="OK">OK</option>
                <option value="OR">OR</option>
                <option value="PA">PA</option>
                <option value="RI">RI</option>
                <option value="SC">SC</option>
                <option value="SD">SD</option>
                <option value="TN">TN</option>
                <option value="TX">TX</option>
                <option value="UT">UT</option>
                <option value="VT">VT</option>
                <option value="VA">VA</option>
                <option value="WA">WA</option>
                <option value="WV">WV</option>
                <option value="WI">WI</option>
                <option value="WY">WY</option>
              </select>
            </div>
            <div className="form-group">
              <label>Zip:</label>
              <input id="homeZip" type="number" min="0" className="form-control" defaultValue={homeInfo && homeInfo.homeZip}/>
            </div>
            </>
            )}
            
            {/* Checkbox display of whether the user wants promos or not*/}
            <div className="form-group">
              <label>Subscribe for promos?:</label>
              <div>
                <input id="promoyes" type="radio" name="promosub" value="yes" className="form-check-input" checked={userInfo.promo} onChange={() => setUserInfo({...userInfo, promo: true})}/>
                <label for="promoyes" className="form-check-label">Yes</label>
                <input id="promono" type="radio" name="promosub" value="no" className="form-check-input" checked={!userInfo.promo} onChange={() => setUserInfo({...userInfo, promo: false})}/>
                <label for="promono" className="form-check-label">No</label>
              </div>
            </div>
        
            <button type="submit" className="btn btn-primary">Submit</button>
            <h5>* Required</h5>
          </form>
          
        </div>

        )}
        
      </div>
    </div>

  );
}

export default EditProfileAdmin;