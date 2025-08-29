import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LeaveForm from './LeaveForm';
import LeaveCalendar from './LeaveCalendar';
import LeaveHistory from './LeaveHistory';
import LeaveStats from './LeaveStats';
import StaffLeaveBalanceTable from './StaffLeaveBalanceTable'; // Import the new component

function StaffDashboard() {
    const [activeTab, setActiveTab] = useState('balance'); // Set default tab to 'balance'
    const [leaves, setLeaves] = useState([]);
    const [balance, setBalance] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            
            // Fetch leaves
            const leavesResponse = await axios.get('/api/staff/leaves/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(leavesResponse.data);
            
            // Fetch balance
            const balanceResponse = await axios.get('/api/staff/leaves/balance/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBalance(balanceResponse.data);
            
            // Fetch stats
            const statsResponse = await axios.get('/api/staff/leaves/stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsResponse.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/');
            return;
        }
        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-white shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Staff Dashboard</h1>
                            <p className="text-gray-600">Welcome, {user.username} ({user.department})</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-4">
                <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6 overflow-x-auto">
                    {['calendar','balance', 'form', 'history', 'stats'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors whitespace-nowrap ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">
                                
                                {tab === 'calendar' && '📅'}
                                {tab === 'balance' && '💰'}
                                {tab === 'form' && '➕'}
                                {tab === 'history' && '📋'}
                                {tab === 'stats' && '📊'}
                            </span>
                            {tab === 'balance' ? 'Leave Balance' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    
                    {activeTab === 'calendar' && <LeaveCalendar leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'balance' && <StaffLeaveBalanceTable balance={balance} />}
                    {activeTab === 'form' && <LeaveForm onLeaveSubmit={fetchData} balance={balance} />}
                    {activeTab === 'history' && <LeaveHistory leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'stats' && <LeaveStats stats={stats} balance={balance} />}
                </div>
            </div>
        </div>
    );
}

export default StaffDashboard;
