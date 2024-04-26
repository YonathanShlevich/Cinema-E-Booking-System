import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';

function AddPromo() {

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const formData = {

          code: document.getElementById("code").value,
          start: document.getElementById("startdate").value,
          end: document.getElementById("enddate").value,
          discount: document.getElementById("discount").value

        }

        console.log(formData.start);

        if (formData.code === "" || formData.discount === "" || formData.start === "" || formData.end === "") {
          window.alert("Ensure code, discount, start date, and end date are inputted");
          
        } else { // all is good

          try {
            const response = await axios.post("http://localhost:4000/promotion/addPromotion", formData);

            if (response.data.status === "FAILED"){
              window.alert(response.data.message);
            } else {
              window.alert("Success!");
              navigate('/admin/manage-promos');
            }
          } catch(error) {
            window.alert(error);
          }
            
        }

    }
  return (

    <div>
      <Link to="/admin/manage-promos" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Add Promo</h2>
        </div>
        <div className="card-body">
            <form id="add-promo-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Promo Code:</label>
              <input id="code" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Discount (%):</label>
              <input id="discount" type="number" min="1" max="100" className="form-control" />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input id = "startdate" type= "date" className="form-control"/>
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input id = "enddate" type= "date" className="form-control"/>
            </div>
            <button type="submit">Submit</button>
            </form>
        
        </div>

      </div>
    </div>

  );
}

export default AddPromo;
