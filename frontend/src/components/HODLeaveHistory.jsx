import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const statusColors = {
    'APPROVED': 'bg-green-100 text-green-800',
    'PENDING': 'bg-amber-100 text-amber-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'CANCELLED': 'bg-gray-100 text-gray-800',
    'PENDING_PRINCIPAL': 'bg-purple-100 text-purple-800'
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
    const [loading, setLoading] = useState(true);

    const fetchMyLeaves = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/hod/leaves/my_leaves/', {
                headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
            });
            setMyLeaves(response.data);
        } catch (error) {
            console.error("Error fetching my leaves:", error);
            toast.error("Failed to load your leave history.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyLeaves();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your leave history...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Leave History</h2>
                <button 
                    onClick={fetchMyLeaves} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                >
                    Refresh
                </button>
            </div>

            {myLeaves.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-5xl mb-4">📝</div>
                    <p className="text-xl font-medium">You have not applied for any leaves yet.</p>
                    <p className="text-gray-600 mt-2">Start by requesting a new leave!</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Download</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {myLeaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.leave_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>{formatDate(leave.start_date)}</div>
                                        <div className="text-gray-500">to {formatDate(leave.end_date)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{leave.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[leave.status]}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a 
                                            href={`http://localhost:8000/api/pdf/generate-pdf/${leave.id}/`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        >
                                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 4V2H15V4H5ZM6 6H14V14H6V6ZM16 16H4V18H16V16Z" clipRule="evenodd" />
                                            </svg>
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}


function DepartmentLeaveHistory({ leaves, onRefresh }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Assuming 'leaves' prop is passed and updated by parent,
        // we just need to manage local loading state if needed, or remove it.
        // For now, just setting loading to false after initial render.
        setLoading(false); 
    }, [leaves]);

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading department leave history...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Department Leave History</h2>
                <button 
                    onClick={onRefresh} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                >
                    Refresh
                </button>
            </div>

            {leaves.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-5xl mb-4">📚</div>
                    <p className="text-xl font-medium">No leave requests found in your department.</p>
                    <p className="text-gray-600 mt-2">Keep an eye out for new requests!</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Staff</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Download</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaves.map((leave) => (
                                <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{leave.staff_name || leave.user?.username}</div>
                                        <div className="text-sm text-gray-500">{leave.staff_department || leave.user?.department}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.leave_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <div>{formatDate(leave.start_date)}</div>
                                        <div className="text-gray-500">to {formatDate(leave.end_date)}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{leave.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusColors[leave.status]}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a 
                                            href={`http://localhost:8000/api/pdf/generate-pdf/${leave.id}/`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                        >
                                            <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 4V2H15V4H5ZM6 6H14V14H6V6ZM16 16H4V18H16V16Z" clipRule="evenodd" />
                                            </svg>
                                            Download
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function HODLeaveHistory({ leaves, onRefresh }) {
    return (
        <div className="space-y-12">
            <DepartmentLeaveHistory leaves={leaves} onRefresh={onRefresh} />
            <MyLeaveHistory />
        </div>
    );
}

export default HODLeaveHistory;
