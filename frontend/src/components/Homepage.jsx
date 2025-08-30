import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-xl shadow-2xl text-center w-full max-w-md border border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
                    Faculty Leave Management
                </h1>
                <p className="text-gray-600 text-lg mb-8">Select your role to proceed to login</p>
                
                <div className="space-y-5">
                    <button 
                        onClick={() => navigate('/login/STAFF')}
                        className="w-full bg-blue-700 text-white py-3.5 rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Staff Login
                    </button>
                    
                    <button 
                        onClick={() => navigate('/login/HOD')}
                        className="w-full bg-green-700 text-white py-3.5 rounded-lg hover:bg-green-800 transition duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        HOD Login
                    </button>
                    
                    <button 
                        onClick={() => navigate('/login/PRINCIPAL')}
                        className="w-full bg-purple-700 text-white py-3.5 rounded-lg hover:bg-purple-800 transition duration-300 ease-in-out font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                        Principal Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
