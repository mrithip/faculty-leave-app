import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function HODLeaveApproval({ leaves, onRefresh }) {
    const [comments, setComments] = useState({});

    const handleApprove = async (leaveId) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`/api/hod/leaves/${leaveId}/approve/`, 
                { comment: comments[leaveId] || '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(prev => ({ ...prev, [leaveId]: '' }));
            onRefresh();
            toast.success('Leave request approved successfully!');
        } catch (error) {
            console.error('Error approving leave:', error);
            toast.error(error.response?.data?.detail || 'Failed to approve leave. Please try again.');
        }
    };

    const handleReject = async (leaveId) => {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post(`/api/hod/leaves/${leaveId}/reject/`, 
                { comment: comments[leaveId] || '' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setComments(prev => ({ ...prev, [leaveId]: '' }));
            onRefresh();
            toast.info('Leave request rejected.');
        } catch (error) {
            console.error('Error rejecting leave:', error);
            toast.error(error.response?.data?.detail || 'Failed to reject leave. Please try again.');
        }
    };

    const handleCommentChange = (leaveId, comment) => {
        setComments(prev => ({ ...prev, [leaveId]: comment }));
    };

    const statusColors = {
        'APPROVED': 'bg-green-100 text-green-800',
        'PENDING': 'bg-amber-100 text-amber-800',
        'REJECTED': 'bg-red-100 text-red-800',
        'CANCELLED': 'bg-gray-100 text-gray-800'
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const pendingLeaves = leaves.filter(leave => leave.status === 'PENDING');

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Leave Approval Dashboard</h2>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                <h3 className="font-bold text-lg mb-2">Pending Approvals: <span className="text-blue-700">{pendingLeaves.length}</span></h3>
                <p className="text-sm">
                    Review and take action on leave requests from staff in your department.
                </p>
            </div>

            {pendingLeaves.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-5xl mb-4">🎉</div>
                    <p className="text-xl font-medium">No pending leave requests to review.</p>
                    <p className="text-gray-600 mt-2">All caught up!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingLeaves.map((leave) => (
                        <div key={leave.id} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                <div>
                                    <h4 className="font-bold text-xl text-gray-900">{leave.staff_name || leave.user?.username}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{leave.staff_department || leave.user?.department}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full mt-2 sm:mt-0 ${statusColors[leave.status]}`}>
                                    {leave.status}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Leave Type:</span>
                                    <p className="font-semibold text-gray-800">{leave.leave_type}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Period:</span>
                                    <p className="text-gray-800">{formatDate(leave.start_date)} to {formatDate(leave.end_date)}</p>
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <span className="text-sm font-medium text-gray-700">Reason:</span>
                                <p className="mt-2 p-3 bg-white rounded-md border border-gray-200 text-gray-800">{leave.reason}</p>
                            </div>
                            
                            <div className="mb-5">
                                <label htmlFor={`comment-${leave.id}`} className="block text-sm font-medium text-gray-700 mb-2">Comment (optional):</label>
                                <input
                                    type="text"
                                    id={`comment-${leave.id}`}
                                    value={comments[leave.id] || ''}
                                    onChange={(e) => handleCommentChange(leave.id, e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                    placeholder="Add a comment for your decision"
                                />
                            </div>
                            
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-end">
                                <button
                                    onClick={() => handleReject(leave.id)}
                                    className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold hover:bg-red-700 transition duration-200 ease-in-out shadow-md"
                                >
                                    Reject Leave
                                </button>
                                <button
                                    onClick={() => handleApprove(leave.id)}
                                    className="w-full sm:w-auto bg-green-600 text-white px-6 py-2.5 rounded-lg text-base font-semibold hover:bg-green-700 transition duration-200 ease-in-out shadow-md"
                                >
                                    Approve Leave
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HODLeaveApproval;
