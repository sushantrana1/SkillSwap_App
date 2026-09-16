import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/navbar/Navbar";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>
      </Routes>

      <Footer />
    </>
  );
};

export default App;
