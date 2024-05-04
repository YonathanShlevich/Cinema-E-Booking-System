import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import axios from "axios";

function ManagePromos() {
  const [promos, setPromos] = useState([]);

  useEffect(() => {
    // Fetch promotions from the backend API
    axios.get('http://localhost:4000/promotion/allPromos')
      .then(response => {
        if (response.data.status === "FAILED") {
          // Handle error if needed
        } else {
          // Set the promotions state with the data from the API response
          setPromos(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching promotions:', error);
      });
  }, []);

  const handleDelete = (promoCode) => {
    // Send a request to delete the promotion with the specified promoCode
    axios.post(`http://localhost:4000/promotion/deletePromotion/${promoCode}`)
      .then(response => {
        if (response.data.status === "SUCCESS") {
          // If the deletion was successful, update the state to reflect the changes
          const updatedPromos = promos.filter(promotion => promotion.code !== promoCode);
          setPromos(updatedPromos);
        } else {
          // Handle unsuccessful deletion
          console.error('Failed to delete promotion:', response.data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting promotion:', error);
      });
  };

  return (
    <div>
      <Link to="/admin" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Manage Promos</h2>
        </div>
        <div className="card-body">
          <h3>Current Promotions</h3>
          <ul>
            {promos.map(promotion => (
              <li key={promotion.code}>
                <div>
                  <span><strong>Promo Code:</strong> {promotion.code}</span>
                  <span><strong> End Date:</strong> {promotion.end.substring(0, 10)}</span>
                  <span><strong> Discount:</strong> {promotion.discount}%</span>
                </div>
                <button className="updateButton" onClick={() => handleDelete(promotion.code)}>Delete</button>
              </li>
            ))}
          </ul>
          <Link className="mainButton" to="/admin/manage-promos/add-promo">+ Add Promo</Link>
        </div>
      </div>
    </div>
  );
}

export default ManagePromos;
