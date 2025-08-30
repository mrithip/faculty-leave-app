import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

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
            toast.success('Leave request approved successfully!'); // Use toast for success
        } catch (error) {
            console.error('Error approving leave:', error);
            toast.error(error.response?.data?.detail || 'Failed to approve leave. Please try again.'); // Use toast for error
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
            toast.info('Leave request rejected.'); // Use toast for info
        } catch (error) {
            console.error('Error rejecting leave:', error);
            toast.error(error.response?.data?.detail || 'Failed to reject leave. Please try again.'); // Use toast for error
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
        <div>
            <h2 className="text-xl font-semibold mb-4">Leave Approval Dashboard</h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Pending Approval: {pendingLeaves.length}</h3>
                <p className="text-sm text-blue-600">
                    You can approve or reject leave requests from staff in your department.
                </p>
            </div>

            {pendingLeaves.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <div className="text-2xl mb-2">🎉</div>
                    <p>No pending leave requests to review.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingLeaves.map((leave) => (
                        <div key={leave.id} className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-semibold text-lg">{leave.staff_name || leave.user?.username}</h4>
                                    <p className="text-sm text-gray-600">{leave.staff_department || leave.user?.department}</p>
                                </div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[leave.status]}`}>
                                    {leave.status}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Leave Type:</span>
                                    <p className="font-medium">{leave.leave_type}</p>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-600">Period:</span>
                                    <p>{formatDate(leave.start_date)} to {formatDate(leave.end_date)}</p>
                                </div>
                            </div>
                            
                            <div className="mb-3">
                                <span className="text-sm font-medium text-gray-600">Reason:</span>
                                <p className="mt-1">{leave.reason}</p>
                            </div>
                            
                            <div className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comment (optional):</label>
                                <input
                                    type="text"
                                    value={comments[leave.id] || ''}
                                    onChange={(e) => handleCommentChange(leave.id, e.target.value)}
                                    className="w-full p-2 border rounded-md text-sm"
                                    placeholder="Add a comment for your decision"
                                />
                            </div>
                            
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleApprove(leave.id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
                                >
                                    Approve Leave
                                </button>
                                <button
                                    onClick={() => handleReject(leave.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                                >
                                    Reject Leave
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
