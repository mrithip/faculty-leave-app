import React from 'react';
import { toast } from 'react-toastify';

function LeaveHistory({ leaves, onRefresh }) {
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

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-6xl mx-auto my-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">My Leave History</h2>
                <button 
                    onClick={onRefresh} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                >
                    Refresh
                </button>
            </div>

            {leaves.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-5xl mb-4">📜</div>
                    <p className="text-xl font-medium">No leave requests found.</p>
                    <p className="text-gray-600 mt-2">Apply for a leave to see your history here!</p>
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
                            {leaves.map((leave) => (
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

export default LeaveHistory;
