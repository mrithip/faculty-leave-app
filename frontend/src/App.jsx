import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/Homepage";
import LoginForm from "./components/LoginForm";
import StaffDash from "./components/StaffDash";
import HodDash from "./components/HodDash";
import PrincipalDash from "./components/PrincipalDash";
import TopBanner from "./components/TopBanner"; 
import Footer from "./components/Footer";    
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen"> 
        <TopBanner />
        <main className="flex-grow"> 
          <Routes>
           
            <Route path="/" element={<HomePage />} />
            <Route path="/login/:role" element={<LoginForm />} />
            
            {/* Protected Routes */}
            <Route path="/staff/dashboard" element={<StaffDash />} />
            <Route path="/hod/dashboard" element={<HodDash />} />
            <Route path="/principal/dashboard" element={<PrincipalDash />} /> 
            
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </Router>
  );
}

export default App;
