import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Verification from "./Verification";
import Admin from "./Admin";
import ManageMovies from "./ManageMovies";
import ManageUsers from "./ManageUsers";
import ManagePromos from "./ManagePromos";
import AddMovie from "./AddMovie";
import AddPromo from "./AddPromo";
import ManageExistingMovies from "./ManageExistingMovies";
import ForgotPassword from "./ForgetPassword";
import HomeLoggedIn from "./HomeLoggedIn";
import BookTicket from "./BookTicket";
import OrderSummary from "./OrderSummary";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/manage-movies" element={<ManageMovies />} />
        <Route path="/admin/manage-users" element={<ManageUsers />} />
        <Route path="/admin/manage-promos" element={<ManagePromos />} />
        <Route path="/admin/manage-movies/add-movie" element={<AddMovie />} />
        <Route path="/admin/manage-movies/manage-existing-movies" element={<ManageExistingMovies />} />
        <Route path="/admin/manage-promos/add-promo" element={<AddPromo />} />


        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/loggedin" element={<HomeLoggedIn />} />

        <Route path="/bookticket" element={<BookTicket />} />
        <Route path="/bookticket/order-summary" element={<OrderSummary />} />
        <Route path="/bookticket/checkout" element={<Checkout />} />
        <Route path="/bookticket/order-confirmation" element={<OrderConfirmation />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
