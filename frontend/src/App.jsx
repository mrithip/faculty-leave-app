import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import StaffDash from "./components/StaffDash";
import HodDash from "./components/HodDash";
import PrincipalDash from "./components/PrincipalDash";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login/:role" element={<LoginForm />} />
        
        {/* Protected Routes */}
        <Route path="/staff/dashboard" element={<StaffDash />} />
        <Route path="/hod/dashboard" element={<HodDash />} />
        <Route path="/principal/dashboard" element={<PrincipalDash />} /> 
        
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;