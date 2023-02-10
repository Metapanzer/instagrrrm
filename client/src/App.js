// import "./App.css";
//Import dependencies
import { Routes, Route } from "react-router-dom";
//Import pages
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Verification from "./pages/verification";
import Profile from "./pages/profile";
import ResetPassword from "./pages/resetPassword";
import ContentDetails from "./pages/contentDetails";

function App() {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/content-details" element={<ContentDetails />} />
      </Routes>
    </div>
  );
}

export default App;
