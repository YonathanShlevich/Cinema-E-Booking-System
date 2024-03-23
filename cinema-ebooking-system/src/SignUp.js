import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import axios from 'axios';

function SignUp() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        // Get form data
      //const formData = {
       // email: document.getElementById("email").value,
       // password: document.getElementById("password").value

        // Add other form fields here
    //};
    
        //References to the ids in the form
        let firstName = document.getElementById("firstName");
        let lastName = document.getElementById("lastName");
        let email = document.getElementById("email");
        let password = document.getElementById("password");
        let confirmPass = document.getElementById("confirmPass");
        let phoneNum = document.getElementById("tel");

        let cardType = document.getElementById("cardType");
        let exp = document.getElementById("exp");
        let cardNumber = document.getElementById("cardNumber");
        let billingAddress = document.getElementById("billingAddress");
        let billingCity = document.getElementById("billingCity");
        let billingState = document.getElementById("billingState");
        let billingZip = document.getElementById("billingZip");
    
        let homeAddress = document.getElementById("homeAddress");
        let homeCity = document.getElementById("homeCity");
        let homeState = document.getElementById("homeState");
        let homeZip = document.getElementById("homeZip");

        //storing what the user input if they want to sub to promo or not
        let promoSubs = document.querySelector('input[name="promosub"]:checked').value;


        if (firstName.value === "" || lastName.value === "" || phoneNum.value === "" || email.value === "" 
            || password.value === "" || confirmPass.value === "") {
          window.alert("Ensure you input a value in all fields marked *");
        } else if (password.value !== confirmPass.value) {
          window.alert("Ensure passwords match!")
        }
        
        else { // all is good
          const formData = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            status: 2,
            type: 1,
            promo: document.getElementById("promoyes").checked
            
            // Add other form fields here
        };
        try {
          // Make POST request to signup endpoint
          const response = await axios.post("http://localhost:5000/user/signup", formData);
          
          // Handle successful signup
          console.log(response.data); // Log response from the API
            // Check if sign-up was successful
          if (response.data.status === "PENDING") {
            // Redirect user to verification page or any other appropriate page
            navigate('/verification');
          } else {
            // Display error message to the user
            window.alert(response.data.message);
          }

          // testing for response
          // window.alert(response.data)
          // Redirect user to verification page
      } catch (error) {
          // Handle signup error
          console.error('signup failed:', error);
          // Display error message to the user
          window.alert(error);
      }

          //  navigate('/verification');
            
        }

    }

    
  return (

    <div>
      {/* Code for form */}
      <Link to="/login" className="backbutton"> Back to Login</Link>
      <div className="card">
        {/* Heading */}
        <div className="card-header">
          <h2>Sign Up</h2>
        </div>
        <div className="card-body">
          {/* When submit is click, it is handled by the function*/}
          <form action="" id="signUpForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>*First Name:</label>
              <input type="text" className="form-control" id="firstName"/>
            </div>
            <div className="form-group">
              <label>*Last Name:</label>
              <input type="text" className="form-control" id="lastName"/>
            </div>
            <div className="form-group">
              <label>*Phone Number: (Format: 123-456-7890)</label>
              <input id="tel" type="tel" className="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder='123-456-7890'/>
            </div>
            <div className="form-group">
              <label>*Email:</label>
              <input id="email" type="email" className="form-control" />
            </div>
            <div className="form-group">
              <label>*Password:</label>
              <input id="password" type="password" className="form-control" />
            </div>
            <div className="form-group">
              <label>*Confirm Password:</label>
              <input id="confirmPass" type="password" className="form-control" />
            </div>
            <p>Optional - Card Information</p>
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
            <div  className="form-group">
              <label>Home Address:</label>
              <input id="homeAddress" type="text" className="form-control" />
            </div>
            <div  className="form-group">
              <label>City:</label>
              <input id="homeCity" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>State:</label>
              {/* Dropdown display of the selected states*/}
              <select id="homeState" className='form-control'>
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
              <input id="homeZip" type="number" min="0" className="form-control" />
            </div>

            {/* Checkbox display of whether the user wants promos or not*/}
            <div className="form-group">
              <label>Subscribe for promos?:</label>
              <div>
                <input id="promoyes" type="radio" name="promosub" value="yes" className="form-check-input" />
                <label for="promoyes" className="form-check-label">Yes</label>
                <input id="promono" type="radio" name="promosub" value="no" className="form-check-input" checked/>
                <label for="promono" className="form-check-label">No</label>
              </div>
            </div>



            <button type="submit" className="btn btn-primary">Register</button>
            <p>* Required</p>
          </form>
          
        </div>
      </div>
    </div>

  );
}
export default SignUp;