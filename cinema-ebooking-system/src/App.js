import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Verification from "./Verification";
import ViewProfile from "./ViewProfile";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import Admin from "./Admin";
import ManageMovies from "./ManageMovies";
import ManageUsers from "./ManageUsers";
import ManagePromos from "./ManagePromos";
import AddMovie from "./AddMovie";
import AddPromo from "./AddPromo";
import ManageExistingMovies from "./ManageExistingMovies";
import ForgotPassword from "./ForgetPassword";
import BookTicket from "./BookTicket";
import OrderSummary from "./OrderSummary";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import SelectSeats from "./SelectSeats";
import AddCard from "./AddCard"
import AddShowtime from "./AddShowtime";

import 'bootstrap/dist/css/bootstrap.min.css';

// Function to check if user is admin
const isAdmin = () => {

  const userType = localStorage.getItem('loggedInUserType');
  return userType === '2';

};

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/addcard" element={<AddCard />} />

        {/* Route for admin page with condition to check if user is admin */}
        <Route
          path="/admin"
          element={isAdmin() ? <Admin /> : <Navigate to="/"
          state={{ message: "Thou shalt not pass to the admin page." }} />}
        />
        <Route path="/admin/manage-movies" element={<ManageMovies />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-promos" element={<ManagePromos />} />
        <Route path="/admin/manage-movies/add-movie" element={<AddMovie />} />
        <Route path="/admin/manage-movies/manage-existing-movies" element={<ManageExistingMovies />} />
        <Route path="/admin/manage-promos/add-promo" element={<AddPromo />} />
        <Route path="/admin/manage-movies/add-showtime" element={<AddShowtime />} />

        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/bookticket" element={<BookTicket />} />
        <Route path="/bookticket/order-summary" element={<OrderSummary />} />
        <Route path="/bookticket/checkout" element={<Checkout />} />
        <Route path="/bookticket/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/bookticket/select-seats" element={<SelectSeats />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
