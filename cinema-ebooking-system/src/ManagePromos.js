import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleUpdate = (id) => {
      // Implement update logic
      console.log(`Update promotion with ID ${id}`);
  };

  const handleDelete = (id) => {
      // Filter out the promotion with the specified ID
      const updatedPromotions = promos.filter(promotion => promotion.id !== id);
      
      // Update the state with the filtered promotions
      setPromos(updatedPromotions);
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
                          <li key={promotion.id}>
                              {promotion.code}
                              <button className="updateButton" onClick={() => handleUpdate(promotion.id)}>Update</button>
                              <button className="updateButton" onClick={() => handleDelete(promotion.id)}>Delete</button>
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