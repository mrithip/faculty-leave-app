import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { role } = useParams();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                username,
                password
            });

            const { access, refresh, user } = response.data;

            // Check if the logged-in user matches the selected role
            if (user.role !== role) {
                toast.error(`This login is for ${role} users only. You are a ${user.role}.`);
                setLoading(false);
                return;
            }

            // Store tokens and user data
            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user', JSON.stringify(user));

            // Fetch and display notifications based on role
            const token = access; // Use the newly obtained access token
            switch (user.role) {
                case 'STAFF':
                    try {
                        const leavesResponse = await axios.get('/api/staff/leaves/', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const recentLeave = leavesResponse.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                        if (recentLeave) {
                            toast.info(`Your most recent leave (${recentLeave.leave_type}) status: ${recentLeave.status}`);
                        } else {
                            toast.info('Welcome! You have no recent leave requests.');
                        }
                    } catch (notificationError) {
                        console.error('Error fetching staff leave status for notification:', notificationError);
                    }
                    navigate('/staff/dashboard');
                    break;
                case 'HOD':
                    try {
                        const deptStatsResponse = await axios.get('/api/hod/leaves/department_stats/', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (deptStatsResponse.data.pending_leaves > 0) {
                            toast.warn(`You have ${deptStatsResponse.data.pending_leaves} new leave requests pending approval.`);
                        } else {
                            toast.info('Welcome HOD! No new leave requests pending in your department.');
                        }
                    } catch (notificationError) {
                        console.error('Error fetching HOD department stats for notification:', notificationError);
                    }
                    navigate('/hod/dashboard');
                    break;
                case 'PRINCIPAL':
                    try {
                        const pendingApprovalsResponse = await axios.get('/api/principal/leaves/pending_approvals/', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        if (pendingApprovalsResponse.data.length > 0) {
                            toast.warn(`You have ${pendingApprovalsResponse.data.length} new leave requests pending your approval.`);
                        } else {
                            toast.info('Welcome Principal! No new leave requests pending your approval.');
                        }
                    } catch (notificationError) {
                        console.error('Error fetching Principal pending approvals for notification:', notificationError);
                    }
                    navigate('/principal/dashboard');
                    break;
                default:
                    navigate('/');
            }

        } catch (error) {
            toast.error(error.response?.data?.detail || 'Login failed. Please check your credentials.'); // Use toast for error
        } finally {
            setLoading(false);
        }
    };

    const roleTitles = {
        'STAFF': 'Staff',
        'HOD': 'Head of Department', 
        'PRINCIPAL': 'Principal'
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-200">
                <div className="text-center mb-8">
                    <div className={`w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg
                        ${role === 'STAFF' ? 'bg-blue-600' : ''}
                        ${role === 'HOD' ? 'bg-green-600' : ''}
                        ${role === 'PRINCIPAL' ? 'bg-purple-600' : ''}`}>
                        {role?.charAt(0)}
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        {roleTitles[role]} Login
                    </h1>
                    <p className="text-gray-600 text-md">Enter your credentials to access your dashboard</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition duration-200 ease-in-out"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-7">
                        <label className="block text-gray-800 text-sm font-semibold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-200 focus:border-blue-500 transition duration-200 ease-in-out"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-800 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition duration-200 ease-in-out"
                    >
                        ← Back to Role Selection
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
