import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function AddPromo() {
  return (

    <div>
      <Link to="/admin/manage-promos" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Add Promo</h2>
        </div>
        <div className="card-body">
            <form id="add-promo-form" onSubmit={submitHandler}>
            <div className="form-group">
              <label>Promo Code:</label>
              <input id="code" type="text" className="form-control" />
            </div>
            <div className="form-group">
              <label>Discout (%):</label>
              <input id="discount" type="number" min="1" max="100" className="form-control" />
            </div>
            <button type="submit">Submit</button>
            </form>
        
        </div>

      </div>
    </div>

  );
}

export default AddPromo;
