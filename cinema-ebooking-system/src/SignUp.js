import React from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

function SignUp() {
  return (

    <div>
      <Link to="/login" className="backbutton"> Back to Login</Link>
      <div className="card">
        <div className="card-header">
          <h2>Sign Up</h2>
        </div>
        <div className="card-body">
          <form>
            <div className="form-group">
              <label>*Name:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>*Phone Number: (Format: 123-456-7890)</label>
              <input type="tel" className="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder='123-456-7890'/>
            </div>
            <div className="form-group">
              <label>*Email:</label>
              <input type="email" className="form-control" />
            </div>
            <div className="form-group">
              <label>*Password:</label>
              <input type="password" className="form-control" />
            </div>
            <div className="form-group">
              <label>*Confirm Password:</label>
              <input type="password" className="form-control" />
            </div>
            <p>Optional - Card Information</p>
            <div className="form-group">
              <label>Card Type:</label>
              <select className="form-control">
                <option selected></option>
                <option value="visa">Visa</option>
                <option value="master">Master Card</option>
                <option value="amex">American Express</option>
                </select>
            </div>
            <div className="form-group">
              <label>Expiration Date:</label>
              <input type="month" className="form-control" />
            </div>
            <div className="form-group">
              <label>Card Number:</label>
              <input type="number" min="0" className="form-control" />
            </div>
            <div className="form-group">
              <label>Billing Address:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>State:</label>
              <select className='form-control'>
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
              <input type="number" min="0" className="form-control" />
            </div>
            <div className="form-group">
              <label>Home Address:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>City:</label>
              <input type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>State:</label>
              <select className='form-control'>
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
              <input type="number" min="0" className="form-control" />
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