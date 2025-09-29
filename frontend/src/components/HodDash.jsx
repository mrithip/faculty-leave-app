import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HODLeaveCalendar from './HODLeaveCalendar';
import HODLeaveHistory from './HODLeaveHistory';
import HODLeaveStats from './HODLeaveStats';
import HODStaffList from './HODStaffList';
import HODLeaveApproval from './HODLeaveApproval';
import HODLeaveForm from './HODLeaveForm';

function HODDashboard() {
    const [activeTab, setActiveTab] = useState('approval');
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Define user here for immediate use

    // Add authentication check for HOD role
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token) {
            navigate('/');
            return;
        }

        if (userData.role !== 'HOD') {
            navigate('/login');
            return;
        }

        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');

            // Add individual error handling for each call to avoid one failure breaking everything
            try {
                const leavesResponse = await axios.get('/api/hod/leaves/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeaves(leavesResponse.data || []);
            } catch (apiError) {
                console.error('Error loading leaves:', apiError);
                setLeaves([]);
            }

            try {
                const statsResponse = await axios.get('/api/hod/leaves/department_stats/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(statsResponse.data || null);
            } catch (apiError) {
                console.error('Error loading stats:', apiError);
                setStats(null);
            }

            try {
                const staffResponse = await axios.get('/api/hod/leaves/staff_list/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const staffData = staffResponse.data || [];
                setStaffList([]);
                // Prepare HOD's own entry for later
                let hodEntry = null;

                try {
                    const balanceResponse = await axios.get('/api/hod/leaves/my_balance/', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const hodBalance = balanceResponse.data || null;
                    hodEntry = {
                        id: user.id,
                        username: `${user.username} (HOD)`,
                        email: user.email,
                        leave_balance: hodBalance
                    };
                } catch (balanceError) {
                    console.error('Error loading HOD balance:', balanceError);
                    hodEntry = {
                        id: user.id,
                        username: `${user.username} (HOD)`,
                        email: user.email,
                        leave_balance: null
                    };
                }

                // Combine HOD entry with staff list
                const combinedStaffList = hodEntry ? [hodEntry, ...staffData] : staffData;
                setStaffList(combinedStaffList);

            } catch (staffError) {
                console.error('Error loading staff list:', staffError);
                setStaffList([]);
            }

        } catch (error) {
            console.error('General error in fetchData:', error);
            // Don't logout on general errors, just log them
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Add role validation fallback
    const token = localStorage.getItem('access_token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || userData.role !== 'HOD') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You need to be logged in as an HOD to access this dashboard.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700 font-medium">Loading HOD dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">HOD Dashboard</h1>
                            <p className="text-gray-600 text-lg mt-1">Welcome, <span className="font-semibold">{user.username}</span> (<span className="font-medium">{user.department}</span>)</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-200 ease-in-out font-medium shadow-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-wrap justify-center md:justify-start space-x-2 sm:space-x-4 bg-white rounded-xl p-2 shadow-lg mb-6 overflow-x-auto">
                    {['approval', 'staff', 'calendar', 'history', 'stats', 'request'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap text-lg font-medium
                                ${
                                    activeTab === tab
                                        ? 'bg-green-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-green-600'
                                }`}
                        >
                            <span className="mr-2 text-xl">
                                {tab === 'approval' && '✅'}
                                {tab === 'staff' && '👥'}
                                {tab === 'calendar' && '📅'}
                                {tab === 'history' && '📜'}
                                {tab === 'stats' && '📊'}
                                {tab === 'request' && '📝'}
                            </span>
                            {tab === 'approval' ? 'Approve Leaves' : 
                             tab === 'staff' ? 'Staff List' :
                             tab === 'request' ? 'Request Leave' :
                             tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
                    {activeTab === 'approval' && <HODLeaveApproval leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'staff' && <HODStaffList staffList={staffList} />}
                    {activeTab === 'calendar' && <HODLeaveCalendar onRefresh={fetchData} />}
                    {activeTab === 'history' && <HODLeaveHistory leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'stats' && <HODLeaveStats stats={stats} />}
                    {activeTab === 'request' && <HODLeaveForm onLeaveSubmit={fetchData} balance={balance} />}
                </div>
            </div>
        </div>
    );
}

export default HODDashboard;
