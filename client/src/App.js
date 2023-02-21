// import "./App.css";
//Import dependencies
import { Routes, Route, useLocation } from "react-router-dom";
//Import pages
import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Verification from "./pages/verification";
import Profile from "./pages/profile";
import EditProfile from "./pages/editProfile";
import ResetPassword from "./pages/resetPassword";
import ContentDetails from "./pages/contentDetails";
import Sidebar from "./components/sidebar";

function App() {
  const location = useLocation();

  return (
    <div className="flex justify-start">
      {location.pathname === "/" ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/content-details") ? (
        <Sidebar />
      ) : null}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/content-details/:contents_id"
          element={<ContentDetails />}
        />
      </Routes>
    </div>
  );
}

export default App;
