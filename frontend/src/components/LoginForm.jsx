import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { role } = useParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                username,
                password
            });

            const { access, refresh, user } = response.data;

            // Check if the logged-in user matches the selected role
            if (user.role !== role) {
                setError(`This login is for ${role} users only. You are a ${user.role}.`);
                setLoading(false);
                return;
            }

            // Store tokens and user data
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case 'STAFF':
                    navigate('/staff/dashboard');
                    break;
                case 'HOD':
                    navigate('/hod/dashboard');
                    break;
                case 'PRINCIPAL':
                    navigate('/principal/dashboard');
                    break;
                default:
                    navigate('/');
            }

        } catch (error) {
            setError(error.response?.data?.detail || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    const roleTitles = {
        'STAFF': 'Staff',
        'HOD': 'Head of Department', 
        'PRINCIPAL': 'Principal'
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="text-center mb-6">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold
                        ${role === 'STAFF' ? 'bg-blue-600' : ''}
                        ${role === 'HOD' ? 'bg-green-600' : ''}
                        ${role === 'PRINCIPAL' ? 'bg-purple-600' : ''}`}>
                        {role?.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {roleTitles[role]} Login
                    </h1>
                    <p className="text-gray-600">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        ← Back to Role Selection
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default LoginForm;