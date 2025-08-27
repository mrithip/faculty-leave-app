import React, { useState } from 'react';

function PrincipalUserStats({ userStats }) {
    const [sortField, setSortField] = useState('total_leaves');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    // Log userStats and searchTerm to debug
    console.log("PrincipalUserStats - userStats:", userStats);
    console.log("PrincipalUserStats - searchTerm:", searchTerm);

    if (!userStats || userStats.length === 0) {
        return <div className="text-center py-8 text-gray-500">No user statistics available.</div>;
    }

    // Filter and sort users
    const filteredUsers = userStats.filter(user => {
        const usernameMatch = user.username && typeof user.username === 'string' && user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const departmentMatch = user.department && typeof user.department === 'string' && user.department.toLowerCase().includes(searchTerm.toLowerCase());
        const roleMatch = user.role && typeof user.role === 'string' && user.role.toLowerCase().includes(searchTerm.toLowerCase());
        
        return usernameMatch || departmentMatch || roleMatch;
    });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortOrder === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const getApprovalRate = (user) => {
        if (user.total_leaves === 0) return 0;
        return (user.approved_leaves / user.total_leaves) * 100;
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">User Leave Statistics</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Users</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, department, or role..."
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Users</label>
                    <div className="text-2xl font-bold text-blue-600">{userStats.length}</div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('username')}
                            >
                                User {getSortIcon('username')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('department')}
                            >
                                Department {getSortIcon('department')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('role')}
                            >
                                Role {getSortIcon('role')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('total_leaves')}
                            >
                                Total {getSortIcon('total_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('approved_leaves')}
                            >
                                Approved {getSortIcon('approved_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('pending_leaves')}
                            >
                                Pending {getSortIcon('pending_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('rejected_leaves')}
                            >
                                Rejected {getSortIcon('rejected_leaves')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Approval Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedUsers.map((user) => (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">{user.department}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        user.role === 'HOD' ? 'bg-purple-100 text-purple-800' :
                                        user.role === 'PRINCIPAL' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{user.total_leaves}</td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 font-medium">{user.approved_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-amber-600 font-medium">{user.pending_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-red-600 font-medium">{user.rejected_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${
                                        getApprovalRate(user) >= 80 ? 'text-green-600' :
                                        getApprovalRate(user) >= 50 ? 'text-amber-600' :
                                        'text-red-600'
                                    }`}>
                                        {getApprovalRate(user).toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Top Users by Leaves</h4>
                    {userStats.slice(0, 3).map((user, index) => (
                        <div key={user.user_id} className="flex justify-between items-center text-sm mb-1">
                            <span>{user.username}</span>
                            <span className="font-semibold">{user.total_leaves}</span>
                        </div>
                    ))}
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Highest Approval</h4>
                    {[...userStats]
                        .filter(u => u.total_leaves > 0)
                        .sort((a, b) => getApprovalRate(b) - getApprovalRate(a))
                        .slice(0, 3)
                        .map((user, index) => (
                        <div key={user.user_id} className="flex justify-between items-center text-sm mb-1">
                            <span>{user.username}</span>
                            <span className="font-semibold text-green-600">{getApprovalRate(user).toFixed(1)}%</span>
                        </div>
                    ))}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Most Pending</h4>
                    {[...userStats]
                        .sort((a, b) => b.pending_leaves - a.pending_leaves)
                        .slice(0, 3)
                        .map((user, index) => (
                        <div key={user.user_id} className="flex justify-between items-center text-sm mb-1">
                            <span>{user.username}</span>
                            <span className="font-semibold text-amber-600">{user.pending_leaves}</span>
                        </div>
                    ))}
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Most Rejected</h4>
                    {[...userStats]
                        .sort((a, b) => b.rejected_leaves - a.rejected_leaves)
                        .slice(0, 3)
                        .map((user, index) => (
                        <div key={user.user_id} className="flex justify-between items-center text-sm mb-1">
                            <span>{user.username}</span>
                            <span className="font-semibold text-red-600">{user.rejected_leaves}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PrincipalUserStats;
