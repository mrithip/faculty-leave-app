import React, { useState, useEffect } from 'react';
import axios from 'axios';

const statusColors = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-amber-100 text-amber-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800',
    'PENDING_PRINCIPAL': 'bg-blue-100 text-blue-800'
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

function MyLeaveHistory() {
    const [myLeaves, setMyLeaves] = useState([]);

    const fetchMyLeaves = async () => {
        try {
            const response = await axios.get('/api/hod/leaves/my_leaves/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setMyLeaves(response.data);
        } catch (error) {
            console.error("Error fetching my leaves:", error);
        }
    };

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">My Leave History</h2>
                <button onClick={fetchMyLeaves} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {myLeaves.map((leave) => (
                            <tr key={leave.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{leave.leave_type}</td>
                                <td className="px-6 py-4">
                                    <div>{formatDate(leave.start_date)}</div>
                                    <div className="text-gray-500">to {formatDate(leave.end_date)}</div>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate">{leave.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[leave.status]}`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <a 
                                        href={`http://localhost:8000/api/pdf/generate-pdf/${leave.id}/`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {myLeaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">You have not applied for any leaves.</div>
            )}
        </div>
    );
}


function DepartmentLeaveHistory({ leaves, onRefresh }) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Department Leave History</h2>
                <button onClick={onRefresh} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                    Refresh
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Download</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {leaves.map((leave) => (
                            <tr key={leave.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium">{leave.staff_name || leave.user?.username}</div>
                                    <div className="text-sm text-gray-500">{leave.staff_department || leave.user?.department}</div>
                                </td>
                                <td className="px-6 py-4">{leave.leave_type}</td>
                                <td className="px-6 py-4">
                                    <div>{formatDate(leave.start_date)}</div>
                                    <div className="text-gray-500">to {formatDate(leave.end_date)}</div>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate">{leave.reason}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[leave.status]}`}>
                                        {leave.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <a 
                                        href={`http://localhost:8000/api/pdf/generate-pdf/${leave.id}/`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {leaves.length === 0 && (
                <div className="text-center py-8 text-gray-500">No leave requests found in your department.</div>
            )}
        </div>
    );
}

function HODLeaveHistory({ leaves, onRefresh }) {
    return (
        <div>
            <DepartmentLeaveHistory leaves={leaves} onRefresh={onRefresh} />
            <MyLeaveHistory />
        </div>
    );
}

export default HODLeaveHistory;
