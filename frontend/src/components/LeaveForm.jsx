import React, { useState } from 'react';
import axios from 'axios';

function LeaveForm({ onLeaveSubmit, balance }) {
    const [formData, setFormData] = useState({
        leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1
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
            const response = await axios.post('/api/staff/leaves/', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setSuccess('Leave request submitted successfully!');
            setFormData({ leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1 });
            if (onLeaveSubmit) onLeaveSubmit();
        } catch (error) {
            setError(error.response?.data?.detail || 'Failed to submit leave request');
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
        <div>
            <h2 className="text-xl font-semibold mb-4">Request Leave</h2>
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                    <select name="leave_type" value={formData.leave_type} onChange={handleInputChange} className="w-full p-2 border rounded-md" required>
                        <option value="">Select Leave Type</option>
                        {leaveTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                        <input type="datetime-local" name="start_date" value={formData.start_date} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                        <input type="datetime-local" name="end_date" value={formData.end_date} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                    <textarea name="reason" value={formData.reason} onChange={handleInputChange} rows={4} className="w-full p-2 border rounded-md" required />
                </div>

                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50">
                    {loading ? 'Submitting...' : 'Submit Leave Request'}
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
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors ml-2.5"
                    >
                        Clear Form
                    </button>
            </form>
        </div>
    );
}

export default LeaveForm;