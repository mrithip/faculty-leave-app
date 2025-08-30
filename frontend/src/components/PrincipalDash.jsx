import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PrincipalLeaveApproval from './PrincipalLeaveApproval';
import PrincipalStats from './PrincipalStats';
import PrincipalUserStats from './PrincipalUserStats';
import PrincipalDepartmentSummary from './PrincipalDepartmentSummary';
import PrincipalLeaveBalanceTable from './PrincipalLeaveBalanceTable';

function PrincipalDashboard() {
    const [activeTab, setActiveTab] = useState('approval');
    const [leaves, setLeaves] = useState([]);
    const [stats, setStats] = useState(null);
    const [userStats, setUserStats] = useState([]);
    const [departmentSummary, setDepartmentSummary] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            
            const leavesResponse = await axios.get('/api/principal/leaves/pending_approvals/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(leavesResponse.data);
            
            const statsResponse = await axios.get('/api/principal/leaves/overview_stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsResponse.data);
            
            const userStatsResponse = await axios.get('/api/principal/leaves/user_stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserStats(userStatsResponse.data);
            
            const deptResponse = await axios.get('/api/principal/leaves/department_summary/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartmentSummary(deptResponse.data);
            
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-lg text-gray-700 font-medium">Loading Principal dashboard data...</p>
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
                            <h1 className="text-3xl font-extrabold text-gray-900">Principal Dashboard</h1>
                            <p className="text-gray-600 text-lg mt-1">Welcome, <span className="font-semibold">{user.username}</span> (Institutional Leave Management)</p>
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
                    {['approval', 'stats', 'users', 'departments', 'leave_balances'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center px-5 py-2.5 rounded-lg transition-all duration-200 ease-in-out whitespace-nowrap text-lg font-medium
                                ${
                                    activeTab === tab
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-purple-600'
                                }`}
                        >
                            <span className="mr-2 text-xl">
                                {tab === 'approval' && '✅'}
                                {tab === 'stats' && '📊'}
                                {tab === 'users' && '👥'}
                                {tab === 'departments' && '🏢'}
                                {tab === 'leave_balances' && '💰'}
                            </span>
                            {tab === 'approval' ? 'Approve Leaves' : 
                             tab === 'stats' ? 'Overview Stats' :
                             tab === 'users' ? 'User Statistics' :
                             tab === 'departments' ? 'Department Summary' :
                             'Leave Balances'}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200">
                    {activeTab === 'approval' && <PrincipalLeaveApproval leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'stats' && <PrincipalStats stats={stats} />}
                    {activeTab === 'users' && <PrincipalUserStats userStats={userStats} />}
                    {activeTab === 'departments' && <PrincipalDepartmentSummary departmentSummary={departmentSummary} />}
                    {activeTab === 'leave_balances' && <PrincipalLeaveBalanceTable />}
                </div>
            </div>
        </div>
    );
}

export default PrincipalDashboard;
