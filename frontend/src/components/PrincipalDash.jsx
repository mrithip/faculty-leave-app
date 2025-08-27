import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PrincipalLeaveApproval from './PrincipalLeaveApproval';
import PrincipalStats from './PrincipalStats';
import PrincipalUserStats from './PrincipalUserStats';
import PrincipalDepartmentSummary from './PrincipalDepartmentSummary';

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
            
            // Fetch pending approvals
            const leavesResponse = await axios.get('/api/principal/leaves/pending_approvals/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeaves(leavesResponse.data);
            
            // Fetch overview stats
            const statsResponse = await axios.get('/api/principal/leaves/overview_stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(statsResponse.data);
            
            // Fetch user stats
            const userStatsResponse = await axios.get('/api/principal/leaves/user_stats/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserStats(userStatsResponse.data);
            
            // Fetch department summary
            const deptResponse = await axios.get('/api/principal/leaves/department_summary/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartmentSummary(deptResponse.data);
            
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
                            <h1 className="text-2xl font-bold text-gray-800">Principal Dashboard</h1>
                            <p className="text-gray-600">Institutional Leave Management</p>
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
                    {['approval', 'stats', 'users', 'departments'].map(tab => (
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
                                {tab === 'stats' && '📊'}
                                {tab === 'users' && '👥'}
                                {tab === 'departments' && '🏢'}
                            </span>
                            {tab === 'approval' ? 'Approve Leaves' : 
                             tab === 'stats' ? 'Overview Stats' :
                             tab === 'users' ? 'User Statistics' :
                             'Department Summary'}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    {activeTab === 'approval' && <PrincipalLeaveApproval leaves={leaves} onRefresh={fetchData} />}
                    {activeTab === 'stats' && <PrincipalStats stats={stats} />}
                    {activeTab === 'users' && <PrincipalUserStats userStats={userStats} />}
                    {activeTab === 'departments' && <PrincipalDepartmentSummary departmentSummary={departmentSummary} />}
                </div>
            </div>
        </div>
    );
}

export default PrincipalDashboard;