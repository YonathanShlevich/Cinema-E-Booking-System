import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function ManagePromos() {
    // Sample promotions data (replace this with your actual promotions data)
    const [promotions, setPromotions] = useState([
      { id: 1, code: "PROMO1" },
      { id: 2, code: "PROMO2" },
      { id: 3, code: "PROMO3" }
    ]);
  
    const handleUpdate = (id) => {
      // Implement update logic
      console.log(`Update promotion with ID ${id}`);
    };
  
    const handleDelete = (id) => {
        // Filter out the promotion with the specified ID
        const updatedPromotions = promotions.filter(promotion => promotion.id !== id);
        
        // Update the state with the filtered promotions
        setPromotions(updatedPromotions);
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
              {promotions.map(promotion => (
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
