import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HODLeaveCalendar from './HODLeaveCalendar';
import HODLeaveHistory from './HODLeaveHistory';
import HODLeaveStats from './HODLeaveStats';
import HODStaffList from './HODStaffList';
import HODLeaveApproval from './HODLeaveApproval';
import HODLeaveForm from './HODLeaveForm'; // Add this import

function HODDashboard() {
    const [activeTab, setActiveTab] = useState('approval');
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [balance, setBalance] = useState(null); // Add balance state
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            
            // Fetch department leaves
            const leavesResponse = await axios.get('/api/hod/leaves/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(leavesResponse.data);
            
            // Fetch department stats
            const statsResponse = await axios.get('/api/hod/leaves/department_stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsResponse.data);
            
            // Fetch staff list
            const staffResponse = await axios.get('/api/hod/leaves/staff_list/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const staffData = staffResponse.data;

            // Fetch HOD's own leave balance
            const balanceResponse = await axios.get('/api/hod/leaves/my_balance/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const hodBalance = balanceResponse.data;

            // Create a HOD entry similar to staff entries
            const hodEntry = {
                id: user.id,
                username: `${user.username} (HOD)`,
                email: user.email,
                leave_balance: hodBalance
            };

            // Combine HOD's balance with staff list, placing HOD at the top
            setStaffList([hodEntry, ...staffData]);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                            <h1 className="text-2xl font-bold text-gray-800">HOD Dashboard</h1>
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
                    {['approval', 'staff', 'calendar', 'history', 'stats', 'request'].map(tab => (
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
                                {tab === 'approval' && '✅'}
                                {tab === 'staff' && '👥'}
                                {tab === 'calendar' && '📅'}
                                {tab === 'history' && '📋'}
                                {tab === 'stats' && '📊'}
                                {tab === 'request' && '➕'}
                            </span>
                            {tab === 'approval' ? 'Approve Leaves' : 
                             tab === 'staff' ? 'Staff List' :
                             tab === 'request' ? 'Request Leave' :
                             tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
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
