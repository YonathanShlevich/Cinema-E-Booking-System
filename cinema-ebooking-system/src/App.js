import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import Verification from "./Verification";
import ForgotPassword from "./ForgetPassword";
import ViewProfile from "./ViewProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/viewprofile" element={<ViewProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
