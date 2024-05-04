import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';
import axios from "axios";

function Checkout() {
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState('existingCard');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); //Used for User's info


    useEffect(() => {
      const getLoggedInUserId = () => {
        return localStorage.getItem('loggedInUserId');
      };
      setLoggedInUserId(getLoggedInUserId());
    }, []);

    //Pulling data from our backend using a Use Effect block: User
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/${loggedInUserId}`) //Calls our data backend GET call
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
  }, [loggedInUserId]);

    const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        // submit to db
        navigate("/bookticket/order-confirmation")
    }
  return (

    <div>
      <Link to="/bookticket/order-summary" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Checkout</h2>
        </div>
        <div className="card-body">
        <div className="form-group">
              <label>*Name:</label>
              <input disabled type="text" className="form-control" id="name" placeholder={userInfo.firstName + " " + userInfo.lastName}/>
            </div>
            <div className="form-group">
              <label>*Phone Number:</label>
              <input disabled id="tel" type="tel" className="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder={userInfo.phoneNumber}/>
            </div>
            <div className="form-group">
              <label>*Email:</label>
              <input disabled id="email" type="email" className="form-control" placeholder={userInfo.email} />
            </div>
            <div className="form-group">
              
                <label>
                <input
                  type="radio"
                  value="existingCard"
                  checked={selectedOption === 'existingCard'}
                  onChange={handleOptionChange}
                />
                Use existing card
              </label>
                    {selectedOption === 'existingCard' && (
                  <select className="form-control">
                    {/* Dropdown options for existing cards */}
                    <option>Card 1</option>
                    <option>Card 2</option>
                    <option>Card 3</option>
                  </select>
                    )}
            </div>
            
              <label>
              <input
                type="radio"
                value="differentCard"
                checked={selectedOption === 'differentCard'}
                onChange={handleOptionChange}
              />
              Input card information
            </label>
            {selectedOption === 'differentCard' && (
              <div>
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
            </div>
            )}
            <p>Promo Code?</p>
            <div className="form-group">
              <label>Enter Promo Code:</label>
              <input id="promo" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Total: $36.99</label>
            </div>
            <button className="btn btn-primary"type="submit" onClick={handleSubmit}>Submit Order</button>
        </div>

      </div>
    </div>

  );
}

export default Checkout;
