import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center w-96">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Faculty Leave Management
                </h1>
                <p className="text-gray-600 mb-8">Select your role to login</p>
                
                <div className="space-y-4">
                    <button 
                        onClick={() => navigate('/login/STAFF')}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Staff Login
                    </button>
                    
                    <button 
                        onClick={() => navigate('/login/HOD')}
                        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                        HOD Login
                    </button>
                    
                    <button 
                        onClick={() => navigate('/login/PRINCIPAL')}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                    >
                        Principal Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;