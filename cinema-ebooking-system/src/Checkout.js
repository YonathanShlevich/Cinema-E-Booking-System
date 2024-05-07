import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Admin.css';
import axios from "axios";

function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [movieFromURL, setMovieFromURL] = useState("");
    const [showtimeFromURL, setShowtimeFromURL] = useState("");
    const [seats, setSeats] = useState([]);
    const [seatNumbers, setSeatNumbers] = useState([]);


    const [selectedOption, setSelectedOption] = useState('existingCard');
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [userInfo, setUserInfo] = useState(null); //Used for User's info
    const [cardInfo, setCardInfo] = useState([]); //Card info, TODO: How to only store 3 cards

    const [selectedCard, setSelectedCard] = useState("");

    const [total, setTotal] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [promoId, setPromoId] = useState(null);

    useEffect(() => {
      const getTotalFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('total');
      };
      const total = getTotalFromURL();
      if (total) {
        setTotal(total);
      }
    }, [location.search]);

    useEffect(() => {
      const getMovieFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('movieTitle');
      };
      const movieTitle = getMovieFromURL();
      if (movieTitle) {
        setMovieFromURL(movieTitle);
      }
    }, [location.search]);
    
    useEffect(() => {
      const getShowtimeFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('showtime');
      };
      const showtime = getShowtimeFromURL();
      if (showtime) {
        setShowtimeFromURL(showtime);
        axios.get(`http://localhost:4000/showtime/pullShowtimeFromID/${showtime}`)
        .then(response => {
          if (response.data.status === "FAILED") {
            // do nothing
            console.log(response.data.message)
          } else {
    
            setShowtimeFromURL(response.data)
           
          }
        })
        .catch(error => { 
          console.error('Error fetching showtime info:', error);
        });
    
      }
    }, [location.search]);

    useEffect(() => {
      const getSeatsFromURL = () => {
        const params = new URLSearchParams(location.search);
        return params.get('seats');
      };
      const encodedSeats = getSeatsFromURL();
      if (encodedSeats) {
        // Decode the URL-encoded string
        const decodedSeatsString = decodeURIComponent(encodedSeats);
  
        // Parse the JSON string into a JavaScript array
        const selectedSeats = JSON.parse(decodedSeatsString);
        const selectedSeatNumbers = selectedSeats.map(seat => seat.seatNumber);
        setSeats(selectedSeats);
        setSeatNumbers(selectedSeatNumbers);


      }
    }, [location.search]);


    useEffect(() => {
      const getLoggedInUserId = () => {
        return localStorage.getItem('loggedInUserId');
      };
      setLoggedInUserId(getLoggedInUserId());
    }, []);

    //Same as previous 2 but for payment card info
  useEffect(() => {
    //Pulls the userID and sets response to second var
    axios.get(`http://localhost:4000/user/data/paymentCard/${loggedInUserId}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
        } else {
          setCardInfo(response.data.cards)

        }
      })
      .catch(error => { 
        console.error('Error fetching user info:', error);
      });
  }, [loggedInUserId]);

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
      setSelectedCard(null)
    };

    const handleSubmit = () => {
        var creditCard = null;
        // submit to db
        if (selectedOption === 'differentCard') { // different card is selected
          const cardType = document.getElementById("cardType").value;
          const cardNumber = document.getElementById("cardNumber").value;
          const billingCity = document.getElementById("billingCity").value;
          const billingState = document.getElementById("billingState").value;
          const billingZip = document.getElementById("billingZip").value;
          const billingAddress = document.getElementById("billingAddress").value;
          const exp = document.getElementById("exp").value;

          if (cardType && cardNumber && billingCity && billingState && billingZip && billingAddress && exp) {
            const cardFormData = {
              cardType: cardType,
              expDate: exp,
              cardNumber: cardNumber,
              billingAddr: billingAddress,
              billingCity: billingCity,
              billingState: billingState,
              billingZip: billingZip
            };

            // add a card
            axios.post(`http://localhost:4000/PaymentCard/addCard`, cardFormData)
            .then(response => {
              if (response.data.status === "FAILED") {
                
                window.alert(response.data.message)
                return;
              } else {
                creditCard = response.data._id;
                const formData = {
                  tickets: seatNumbers,
                  showTime: showtimeFromURL,
                  creditCard: creditCard,
                  userId: loggedInUserId,
                  promoId: promoId,
                  total: (total - total*discount).toFixed(2)
                };
              axios.post(`http://localhost:4000/Booking/addBooking`, formData) //Calls our data backend GET call
              .then(response => {
                if (response.data.status === "FAILED") {
                  // do nothing
                  window.alert("Submit failed: " + response.data.message)
                } else {
                  navigate(`/bookticket/order-confirmation?booking=${response.data._id}`)
        
                }
                
              })
              .catch(error => {
                window.alert(error)
                console.error('Error fetching user info:', error);
              });
              }
              
            })
            .catch(error => {
              console.error('Error fetching promo info:', error);
            });




          } else { // not all the infomation is entered
            window.alert("not all card info is entered")
            return;
          }
          
        } else {
          creditCard = selectedCard;
            const formData = {
              tickets: seatNumbers,
              showTime: showtimeFromURL,
              creditCard: creditCard,
              userId: loggedInUserId,
              promoId: promoId,
              total: (total - total*discount).toFixed(2)
            };
          axios.post(`http://localhost:4000/Booking/addBooking`, formData) //Calls our data backend GET call
          .then(response => {
            if (response.data.status === "FAILED") {
              // do nothing
              window.alert("Submit failed: " + response.data.message)
            } else {
              navigate(`/bookticket/order-confirmation?booking=${response.data._id}`)

            }
            
          })
          .catch(error => {
            window.alert(error)
            console.error('Error fetching user info:', error);
          });

        }
        

        
        //navigate("/bookticket/order-confirmation")
    }
    const handleBack = () => {
      navigate(`/bookticket/order-summary?movieTitle=${movieFromURL}&showtime=${encodeURIComponent(showtimeFromURL._id)}&seats=${encodeURIComponent(JSON.stringify(seats))}`);

    }

    const handlePromo = (event) => {
      const promoCode = document.getElementById("promo").value;
      axios.get(`http://localhost:4000/Promotion/promoCode/${promoCode}`) //Calls our data backend GET call
      .then(response => {
        if (response.data.status === "FAILED") {
          // do nothing
          window.alert(response.data.message)
        } else {
          setDiscount((response.data.discount/100))
          setPromoId(promoCode)
        }
        
      })
      .catch(error => {
        console.error('Error fetching promo info:', error);
      });
    };

    const handleCardChange = (event) => {
      setSelectedCard(event.target.value);
    };

  return (

    <div>
      <button className="backbutton" onClick={(handleBack)}> Really? You want to go back now?</button>
      <div className="card">
        <div className="card-header">
          <h2>Checkout</h2>
        </div>
        <div className="card-body">
        <div className="form-group">
              <label>*Name:</label>
              <input disabled type="text" className="form-control" id="name" placeholder={userInfo && userInfo.firstName + " " + userInfo.lastName}/>
            </div>
            <div className="form-group">
              <label>*Phone Number:</label>
              <input disabled id="tel" type="tel" className="form-control" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder={userInfo && userInfo.phoneNumber}/>
            </div>
            <div className="form-group">
              <label>*Email:</label>
              <input disabled id="email" type="email" className="form-control" placeholder={userInfo && userInfo.email} />
            </div>
            {cardInfo && 
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
                  <select className="form-control" onChange={handleCardChange}>
                    <option selected></option>
                    {cardInfo.map(card => (
                      <option key={card._id} className="saved-cards" value={card._id}>
                          {card.cardType} ****{card.cardNumber?.toString().slice(-4)}
                      </option>
                    ))}
                  </select>
                    )}
            </div>
              
              
              }
            
            
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
             <button className="btn btn-primary" onClick={handlePromo}>Apply Promo</button>

            <div className="form-group">
              <label>Total: ${(total - total*discount).toFixed(2)}</label>
            </div>
            { (selectedCard && selectedOption === 'existingCard' )&&
            <button className="btn btn-primary"type="submit" onClick={handleSubmit}>Submit Order</button>

            }
            { 
              selectedOption === 'differentCard' &&
            <button className="btn btn-primary"type="submit" onClick={handleSubmit}>Submit Order</button>

            }
            
        </div>

      </div>
    </div>

  );
}

export default Checkout;
