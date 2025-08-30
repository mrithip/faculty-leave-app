import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

function HODLeaveForm({ onLeaveSubmit, balance }) {
    const [formData, setFormData] = useState({
        leave_type: '', 
        start_date: '', 
        end_date: '', 
        reason: '', 
        is_hourly: false, 
        hours: 1
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/api/leave/requests/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Leave request submitted successfully! It will be reviewed by the Principal.');
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
            toast.error(errorMessage); // Use toast for error
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
        { value: 'EARNED', label: 'Earned Leave' },
        { value: 'CASUAL', label: 'Casual Leave' },
        { value: 'MEDICAL', label: 'Medical Leave'},
        { value: 'COMPENSATORY', label: 'Compensatory Leave' },
        { value: 'MATERNITY', label: 'Maternity Leave', description: 'For female staff only' }, // Added Maternity Leave
        { value: 'PATERNITY', label: 'Paternity Leave', description: 'For male staff only' },
        { value: 'ONDUTY', label: 'On Duty Leave', description: 'For official duties' },
        { value: 'CUSTOM', label: 'Custom Leave (1 Hour)', description: 'Max 2 per month' }
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-3xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Request Leave (HOD)</h2>
            
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                <h3 className="font-bold text-lg mb-2">Leave Request Process for HODs</h3>
                <p className="text-sm">
                    As a Head of Department, your leave requests will be reviewed and approved by the Principal. Please fill out the form carefully.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="leave_type" className="block text-sm font-medium text-gray-800 mb-2">
                        Leave Type <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="leave_type"
                        name="leave_type"
                        value={formData.leave_type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-800 mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-800 mb-2">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                            required
                        />
                    </div>
                </div>

                {formData.leave_type === 'CUSTOM' && (
                    <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <input
                            type="checkbox"
                            id="is_hourly"
                            name="is_hourly"
                            checked={formData.is_hourly}
                            onChange={handleInputChange}
                            className="form-checkbox h-5 w-5 text-yellow-600 rounded focus:ring-yellow-500"
                            required={formData.leave_type === 'CUSTOM'}
                        />
                        <label htmlFor="is_hourly" className="text-sm font-medium text-gray-800">
                            Confirm this is a 1-hour leave (Max 2 per month)
                        </label>
                        {formData.is_hourly && (
                            <input
                                type="number"
                                name="hours"
                                value={formData.hours}
                                onChange={handleInputChange}
                                min="1"
                                max="8"
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                placeholder="Hours"
                                required
                            />
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-800 mb-2">
                        Reason for Leave <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                        placeholder="Please provide a detailed reason for your leave request..."
                        required
                    />
                </div>

                <div className="flex justify-end space-x-4">
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
                        className="px-6 py-2.5 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
                    >
                        Clear Form
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'Submit Leave Request'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HODLeaveForm;
