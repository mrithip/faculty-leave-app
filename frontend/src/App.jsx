import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import StaffDash from "./components/StaffDash";
import HodDash from "./components/HodDash";
import PrincipalDash from "./components/PrincipalDash";
import TopBanner from "./components/TopBanner"; // Import TopBanner
import Footer from "./components/Footer";     // Import Footer

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> {/* Flex container for full height */}
        <TopBanner /> {/* Render TopBanner above all routes */}
        <main className="flex-grow"> {/* Main content area */}
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
        </main>
        <Footer /> {/* Render Footer below all routes */}
      </div>
    </Router>
  );
}

export default App;
