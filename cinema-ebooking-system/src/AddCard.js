import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';
import axios from 'axios';

function AddCard() {
    const userId = localStorage.getItem('loggedInUserId');


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const formData = {
            cardType: document.getElementById("cardType").value,
            expDate: document.getElementById("exp").value,
            cardNumber: document.getElementById("cardNumber").value,
            billingAddr: document.getElementById("billingAddress").value,
            billingCity: document.getElementById("billingCity").value,
            billingState: document.getElementById("billingState").value,
            billingZip: document.getElementById("billingZip").value
        }
        try {
            // Make the API call to add the card
            const response = await axios.post(`http://localhost:4000/user/addCard/${userId}`, formData);

            
            
            console.log(response.data); // Log the response from the server

            if (response.data.status === "FAILED") {
                window.alert("Error: " + response.data.message);
            } else {
                
                navigate("/viewprofile");
                // success
            }
            
            // Optionally, you can perform any actions upon successful addition of the card
        } catch (error) {
            window.alert("An error occured trying to add card");
            console.error('Error adding card:', error); // Log any errors
            
            // Optionally, you can handle errors or display an error message to the user
        }



    
        

    }
  return (

    <div>
      <Link to="/viewprofile" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Add Card</h2>
        </div>
        <div className="card-body">
            <form id="add-promo-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Card Type:</label>
              <select id="cardType" className="form-control">
                <option selected></option>
                <option value="visa">Visa</option>
                <option value="master">Master Card</option>
                <option value="amex">American Express</option>
                </select>
            </div>
            <div className="form-group">
              <label>Expiration Date:</label>
              <input id="exp" type="month" className="form-control" />
            </div>
            <div className="form-group">
              <label>Card Number:</label>
              <input id="cardNumber" type="number" min="0" className="form-control" />
            </div>
            <div className="form-group">
              <label>Billing Address:</label>
              <input id="billingAddress" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input id="billingCity" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>State:</label>
              {/* Dropdown display of the selected states*/}
              <select id="billingState" className='form-control'>
                <option selected></option>
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
              <input id="billingZip" type="number" min="0" className="form-control" />
            </div>
            <button type="submit" onClick={handleSubmit} className="btn btn-primary">Submit Card Information</button>
            
            </form>
        
        </div>

      </div>
    </div>

  );
}

export default AddCard;
