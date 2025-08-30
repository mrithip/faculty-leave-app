import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast

function LeaveForm({ onLeaveSubmit, balance }) {
    const [formData, setFormData] = useState({
        leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/api/staff/leaves/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast.success('Leave request submitted successfully!');
            setFormData({ leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1 });
            if (onLeaveSubmit) onLeaveSubmit();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to submit leave request');
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
        { value: 'MEDICAL', label: 'Medical Leave' },
        { value: 'COMPENSATORY', label: 'Compensatory Leave' },
        { value: 'MATERNITY', label: 'Maternity Leave' },
        { value: 'PATERNITY', label: 'Paternity Leave' },
        { value: 'ONDUTY', label: 'On Duty Leave' },
        { value: 'CUSTOM', label: 'Custom Leave (1 Hour)' }
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-3xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Request Leave</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="leave_type" className="block text-sm font-medium text-gray-800 mb-2">Leave Type <span className="text-red-500">*</span></label>
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
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="start_date" className="block text-sm font-medium text-gray-800 mb-2">Start Date <span className="text-red-500">*</span></label>
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
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-800 mb-2">End Date <span className="text-red-500">*</span></label>
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

                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="is_hourly"
                        name="is_hourly"
                        checked={formData.is_hourly}
                        onChange={handleInputChange}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_hourly" className="text-sm font-medium text-gray-800">Hourly Leave</label>
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

                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-800 mb-2">Reason <span className="text-red-500">*</span></label>
                    <textarea 
                        id="reason"
                        name="reason" 
                        value={formData.reason} 
                        onChange={handleInputChange} 
                        rows={5} 
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out" 
                        placeholder="Briefly describe your reason for leave"
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
                        {loading ? 'Submitting...' : 'Submit Leave Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LeaveForm;
