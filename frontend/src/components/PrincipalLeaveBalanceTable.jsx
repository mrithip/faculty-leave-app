import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrincipalLeaveBalanceTable() {
    const [allBalances, setAllBalances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAllLeaveBalances = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('access_token');
            console.log("Fetching all leave balances...");
            const response = await axios.get('http://localhost:8000/api/leave/balance/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("API Response for leave balances:", response.data);
            setAllBalances(response.data);
        } catch (err) {
            console.error("Error fetching all leave balances:", err);
            setError('Failed to load leave balances.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllLeaveBalances();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading all leave balances...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">{error}</div>;
    }

    if (allBalances.length === 0) {
        return <div className="text-center py-8 text-gray-500">No leave balances found.</div>;
    }

    const getBalanceColor = (value, type) => {
        if (type === 'credits') {
            return value > 5 ? 'bg-green-100 text-green-800' : 
                   value > 2 ? 'bg-amber-100 text-amber-800' : 
                   'bg-red-100 text-red-800';
        } else { // days
            return value > 8 ? 'bg-green-100 text-green-800' : 
                   value > 4 ? 'bg-amber-100 text-amber-800' : 
                   'bg-red-100 text-red-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">All Staff & HOD Leave Balances</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned Leave</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Casual Leave</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical Leave</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Night Work Credits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compensatory Leave</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {allBalances.map((balance) => (
                            <tr key={balance.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{balance.user_name}</td>
                                <td className="px-6 py-4">{balance.user_role}</td>
                                <td className="px-6 py-4">{balance.user_department}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(balance.earned_leave, 'days')}`}>
                                        {balance.earned_leave} days
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(balance.casual_leave, 'days')}`}>
                                        {balance.casual_leave} days
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(balance.medical_leave, 'days')}`}>
                                        {balance.medical_leave} days
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(balance.night_work_credits, 'credits')}`}>
                                        {balance.night_work_credits} credits
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBalanceColor(balance.compensatory_leave, 'days')}`}>
                                        {balance.compensatory_leave} days
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PrincipalLeaveBalanceTable;
