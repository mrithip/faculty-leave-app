import React, { useState } from 'react';
import axios from 'axios';

function HODLeaveForm({ onLeaveSubmit, balance }) {
    const [formData, setFormData] = useState({
        leave_type: '', 
        start_date: '', 
        end_date: '', 
        reason: '', 
        is_hourly: false, 
        hours: 1
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/leave/requests/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess('Leave request submitted successfully! It will be reviewed by the Principal.');
            setFormData({ 
                leave_type: '', 
                start_date: '', 
                end_date: '', 
                reason: '', 
                is_hourly: false, 
                hours: 1 
            });
            
            if (onLeaveSubmit) onLeaveSubmit();
        } catch (error) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.detail || 
                               error.response?.data?.message ||
                               Object.values(error.response?.data || {}).flat().join(', ') ||
                               'Failed to submit leave request. Please check your input.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const leaveTypes = [
        { value: 'EARNED', label: 'Earned Leave', description: `Balance: ${balance?.earned_leave || 0} days` },
        { value: 'CASUAL', label: 'Casual Leave', description: `Balance: ${balance?.casual_leave || 0} days` },
        { value: 'MEDICAL', label: 'Medical Leave', description: `Balance: ${balance?.medical_leave || 0} days` },
        { value: 'COMPENSATORY', label: 'Compensatory Leave', description: `Balance: ${balance?.compensatory_leave || 0} days` },
        { value: 'PATERNITY', label: 'Paternity Leave', description: 'For male staff only' },
        { value: 'ONDUTY', label: 'On Duty Leave', description: 'For official duties' },
        { value: 'CUSTOM', label: 'Custom Leave (1 Hour)', description: 'Max 2 per month' }
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Request Leave (HOD)</h2>
            
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Leave Request Process</h3>
                <p className="text-sm text-blue-600">
                    As a Head of Department, your leave requests will be reviewed and approved by the Principal.
                </p>
            </div>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <strong>Error:</strong> {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Type *
                    </label>
                    <select
                        name="leave_type"
                        value={formData.leave_type}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label} - {type.description}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date *
                        </label>
                        <input
                            type="datetime-local"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date *
                        </label>
                        <input
                            type="datetime-local"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {formData.leave_type === 'CUSTOM' && (
                    <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                        <input
                            type="checkbox"
                            name="is_hourly"
                            checked={formData.is_hourly}
                            onChange={handleInputChange}
                            className="mr-2"
                            required={formData.leave_type === 'CUSTOM'}
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Confirm this is a 1-hour leave (Max 2 per month)
                        </label>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Leave *
                    </label>
                    <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Please provide a detailed reason for your leave request..."
                        required
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Leave Request'
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => setFormData({ 
                            leave_type: '', 
                            start_date: '', 
                            end_date: '', 
                            reason: '', 
                            is_hourly: false, 
                            hours: 1 
                        })}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                        Clear Form
                    </button>
                </div>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Leave Balance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex justify-between">
                        <span>Earned Leave:</span>
                        <span className="font-semibold">{balance?.earned_leave || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Casual Leave:</span>
                        <span className="font-semibold">{balance?.casual_leave || 0} days</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Medical Leave:</span>
                        <span className="font-semibold">{balance?.medical_leave || 0} days</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HODLeaveForm;