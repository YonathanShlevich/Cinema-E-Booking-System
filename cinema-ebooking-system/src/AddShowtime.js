import React, {useState, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Admin.css';


function AddShowtime() {

    const [movies, setMovies] = useState([]);
    const [showPeriods, setShowPeriods] = useState([]);
    const [showTimes, setShowTimes] = useState([]);


    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:4000/movie/allMovies`)
          .then(response => {
            if (response.data.status === "FAILED") {
              // do nothing
            } else {
              setMovies(response.data)
            }
          })
          .catch(error => { 
            console.error('Error fetching user info:', error);
          });
      }, []);

      useEffect(() => {
        axios.get(`http://localhost:4000/showperiod/allShowPeriods`)
          .then(response => {
            if (response.data.status === "FAILED") {
              // do nothing
            } else {
              setShowPeriods(response.data)
            }
          })
          .catch(error => { 
            console.error('Error fetching user info:', error);
          });
      }, []);

      useEffect(() => {
        const fetchShowTimes = async () => {
          try {
            const response = await axios.get(`http://localhost:4000/showtime/allShowtimes`);
            if (response.data.status === "FAILED") {
              // handle error if needed
              return;
            }
            
            const updatedShowTimes = await Promise.all(response.data.map(async showtime => {
              try {
                const periodResponse = await axios.get(`http://localhost:4000/Showtime/pullShowPeriodfromId/${showtime.period}`);
                if (periodResponse.data.status !== "FAILED") {
                  return {
                    ...showtime,
                    period: periodResponse.data.time
                  };
                } else {
                  // Handle error if needed
                  console.error(`Error fetching period for showtime ID ${showtime._id}`);
                  return showtime;
                }
              } catch (error) {
                console.error('Error fetching period info:', error);
                return showtime;
              }
            }));
      
            setShowTimes(updatedShowTimes);
            
            console.log("Showtimes:", updatedShowTimes); // Check the contents of showTimes
    
          } catch (error) {
            console.error('Error fetching showTime info:', error);
          }
        };
      
        fetchShowTimes();
      }, []);

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        
        const formData = {
          movieTitle: document.getElementById("title").value,
          roomName: "Theatre1",
          periodTime: document.getElementById("showPeriod").value,
          date: document.getElementById("date").value
        }
        console.log(
        formData.movieTitle +
        formData.roomName +
        formData.periodTime + 
        formData.date)
        
        if(
          formData.movieTitle === "" || 
          formData.roomName === "" || 
          formData.periodTime === "" ||
          formData.date === null ) { // reviews.value === "" || showdatesandtimes.value === "" removed 
          
          window.alert("Ensure you input a value in all fields marked");
        } else { // all is good
            /*
              Post to 'addShowtime' and send to database
            */
            try {
              const response = await axios.post("http://localhost:4000/showtime/addShowtime", formData);

              if (response.data.status === "FAILED"){
                window.alert(response.data.message);
              } else {
                window.alert("Success!");
              }
            } catch(error) {
              window.alert(error);
            }
            
        }

    }

  return (

    <div>
      <Link to="/admin/manage-movies" className="backbutton"> Back</Link>
      <div className="card">
        <div className="card-header">
          <h2>Add Showtime</h2>
        </div>
        <div className="card-body">
            <form id="addMovieForm" onSubmit={handleSubmit}>
                <div className="form-group">
                <label>*Movie Title:</label>
                <select id="title" type="text" className="form-control" >
                    <option selected value=""></option>
                    
                    {movies
                    .map(movie => (
                    
                    <option  key={movie._id} value={movie.title}>{movie.title}</option>
                    ))}
                </select>
                </div>
                <div className="form-group">
                <label>*Date</label>
                <input id="date" type="date" className="form-control" />
                </div>
                <div className="form-group">
                <label>*Show Period:</label>
                <select id="showPeriod" type="text" className="form-control" >
                    <option selected value=""></option>
                    
                    {showPeriods
                    .map(period => (
                    
                    <option  key={period._id} value={period.time}>{period.time}</option>
                    ))}
                </select>
                </div>
                

                <button type="submit" className="btn btn-primary">Submit</button>
                <p>* Required</p>
            </form>
        
        </div>

      </div>
    </div>

  );
}

export default AddShowtime;
