import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SubstitutionForm from './SubstitutionForm';
import SubstitutionRequests from './SubstitutionRequests';

function LeaveForm({ onLeaveSubmit, balance }) {
    const [substitutionStep, setSubstitutionStep] = useState('pending'); // pending, searching, selected, requested, accepted, rejected
    const [selectedSubstitute, setSelectedSubstitute] = useState(null);
    const [pendingSubstitutionId, setPendingSubstitutionId] = useState(null);

    const [formData, setFormData] = useState({
        leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1
    });

    const [substitutionData, setSubstitutionData] = useState({
        date: '',
        period: '',
        time: '',
        class_label: '',
        message: ''
    });

    const [leaveLoading, setLeaveLoading] = useState(false);
    const [substitutionLoading, setSubstitutionLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Polling effect
    useEffect(() => {
        let intervalId = null;

        // Start polling only if there's a pending request
        if (pendingSubstitutionId) {
            intervalId = setInterval(() => {
                checkSubstitutionUpdate();
            }, 5000);
        }

        // Clean up function
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [pendingSubstitutionId]);

    // Initial data loading
    useEffect(() => {
        checkSubstitutionStatus();
    }, []);

    const checkSubstitutionStatus = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/substitution/sent_requests/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Check if there are any active leave requests that don't need new substitution
            let hasRecentLeaveRequest = false;
            try {
                const leaveResponse = await axios.get('/api/staff/leaves/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // If there's a recent leave request (within last hour), don't show old substitution
                const recentLeave = leaveResponse.data.find(leave => {
                    const leaveDate = new Date(leave.created_at);
                    const now = new Date();
                    const hoursDiff = (now - leaveDate) / (1000 * 60 * 60);
                    return hoursDiff < 1; // Within last hour
                });
                hasRecentLeaveRequest = !!recentLeave;
            } catch (leaveError) {
                console.log('Error checking recent leave requests:', leaveError);
            }

            if (response.data.length > 0) {
                // Check for accepted requests first - but only if no recent leave request
                const acceptedRequest = response.data.find(req => req.status === 'ACCEPTED');
                if (acceptedRequest && !hasRecentLeaveRequest) {
                    console.log('Found accepted substitution request');
                    setSubstitutionStep('accepted');
                    setSelectedSubstitute(acceptedRequest);
                    return;
                }

                // Check for pending requests
                const pendingRequest = response.data.find(req => req.status === 'PENDING');
                if (pendingRequest) {
                    console.log('Found pending substitution request:', pendingRequest.id);
                    setPendingSubstitutionId(pendingRequest.id);
                    setSubstitutionStep('requested');
                    // Auto-fill leave form with substitution date/time
                    if (pendingRequest.date && pendingRequest.time) {
                        setFormData(prev => ({
                            ...prev,
                            start_date: `${pendingRequest.date}T${pendingRequest.time}`,
                            end_date: `${pendingRequest.date}T17:00`
                        }));
                    }
                    return;
                }

                // Check for most recent rejected request
                const rejectedRequests = response.data.filter(req => req.status === 'REJECTED');
                if (rejectedRequests.length > 0) {
                    const mostRecentRejected = rejectedRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
                    console.log('Found rejected substitution request, showing rejection UI');
                    setSubstitutionStep('rejected');
                    setSelectedSubstitute(null);
                    setSubstitutionData({ date: '', period: '', time: '', class_label: '', message: '' });
                    return;
                }

                console.log('No valid requests found, going to pending state');
                setSubstitutionStep('pending');
            } else {
                console.log('No requests found, going to pending state');
                setSubstitutionStep('pending');
            }
        } catch (error) {
            console.error('Failed to check substitution status:', error);
        }
    };

    const checkSubstitutionUpdate = async () => {
        if (!pendingSubstitutionId) return; // Don't poll if no pending request

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/substitution/sent_requests/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Polling substitution status for request:', pendingSubstitutionId);
            console.log('API response:', response.data);

            // Find our specific pending request
            const ourRequest = response.data.find(req => req.id === pendingSubstitutionId);

            if (ourRequest) {
                console.log('Our request status:', ourRequest.status);

                if (ourRequest.status === 'ACCEPTED') {
                    const substitutionWithUser = {
                        ...ourRequest,
                        requested_to_username: ourRequest.requested_to_username || ourRequest.requested_to?.username
                    };
                    setSubstitutionStep('accepted');
                    setSelectedSubstitute(substitutionWithUser);
                    setPendingSubstitutionId(null);
                    toast.success('Substitution request accepted! You can now submit your leave request.');
                } else if (ourRequest.status === 'REJECTED') {
                    console.log('Detected rejection, updating UI and stopping polling...');
                    setSubstitutionStep('rejected');
                    setSelectedSubstitute(null);
                    setSubstitutionData({ date: '', period: '', time: '', class_label: '', message: '' });
                    setPendingSubstitutionId(null); // This will trigger useEffect to stop polling
                    toast.error('Substitution request was rejected. Please choose another colleague.');
                    return; // Stop any further processing in this poll
                } else if (ourRequest.status === 'PENDING') {
                    // Still waiting, update display data
                    const substituteWithUser = {
                        ...ourRequest,
                        requested_to_username: ourRequest.requested_to_username || ourRequest.requested_to?.username
                    };
                    setSelectedSubstitute(substituteWithUser);
                    setSubstitutionData({
                        date: ourRequest.date || '',
                        period: ourRequest.period || '',
                        time: ourRequest.time || '',
                        class_label: ourRequest.class_label || '',
                        message: ourRequest.message || ''
                    });
                }
            } else {
                console.log('Our request not found in response');
            }
        } catch (error) {
            console.error('Failed to check substitution update:', error);
        }
    };



    // Handle substitution selection change
    const handleSubstitutionChange = (e) => {
        const { name, value } = e.target;
        setSubstitutionData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle substituting teacher selection
    const handleSubstituteSelect = (user) => {
        setSelectedSubstitute(user);
        setSearchResults([]);
        setSearchQuery('');
        setSubstitutionStep('selected');
    };

    // Handle substitution request submission
    const handleSubstitutionRequest = async () => {
        if (!selectedSubstitute || !substitutionData.date || !substitutionData.period || !substitutionData.time) {
            toast.error('Please fill all required substitution fields');
            return;
        }

        setSubstitutionLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/substitution/', {
                ...substitutionData,
                requested_to: selectedSubstitute.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPendingSubstitutionId(response.data.id);
            setSubstitutionStep('requested');
            setSubstitutionData({
                date: '', period: '', time: '', class_label: '', message: ''
            });
            setSelectedSubstitute(null);
            toast.info('Substitution request sent. Waiting for approval...');
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send substitution request');
            if (error.response?.status === 400) {
                setSubstitutionStep('rejected');
                setSelectedSubstitute(null);
            }
        } finally {
            setSubstitutionLoading(false);
        }
    };

    // Handle choosing different substitute (when rejected)
    const handleChooseAnotherSubstitute = () => {
        setSubstitutionStep('pending');
        setSelectedSubstitute(null);
        setPendingSubstitutionId(null);
        setSubstitutionData({
            date: '', period: '', time: '', class_label: '', message: ''
        });
    };

    // Handle search for substitute teachers
    const handleSearchSubstitute = async () => {
        if (!searchQuery.trim()) {
            toast.warning('Please enter a search term');
            return;
        }

        setSearching(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`/api/substitution/search_users/?q=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                toast.info('No department staff found matching the search');
            }
        } catch (error) {
            toast.error('Search failed');
            console.error(error);
        } finally {
            setSearching(false);
        }
    };

    // Handle final leave request submission (when substitution is accepted)
    const handleSubmitLeaveRequest = async (e) => {
        e.preventDefault();
        if (substitutionStep !== 'accepted') {
            toast.error('Substitution must be accepted before submitting leave request');
            return;
        }

        setLeaveLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const data = {
                ...formData,
                substitution: selectedSubstitute.id
            };
            await axios.post('/api/staff/leaves/', data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Leave request submitted successfully!');
            // Reset everything
            setFormData({ leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1 });
            setSubstitutionData({ date: '', period: '', time: '', class_label: '', message: '' });
            setSubstitutionStep('pending');
            setSelectedSubstitute(null);
            setPendingSubstitutionId(null);
            if (onLeaveSubmit) onLeaveSubmit();
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to submit leave request');
        } finally {
            setLeaveLoading(false);
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

    // Periods and times for substitution
    const periods = [
        'Morning Session', 'Afternoon Session', 'Evening Session',
        'Full Day', 'Period 1', 'Period 2', 'Period 3', 'Period 4'
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Request Leave</h2>

            {/* Leave Form Section */}
            <form onSubmit={handleSubmitLeaveRequest} className="space-y-6">
                {/* Leave Details */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Leave Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">Leave Type <span className="text-red-500">*</span></label>
                            <select
                                name="leave_type"
                                value={formData.leave_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Select Leave Type</option>
                                {leaveTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">Start Date <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-800 mb-2">End Date <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="is_hourly"
                                checked={formData.is_hourly}
                                onChange={handleInputChange}
                                className="form-checkbox h-5 w-5 text-blue-600"
                            />
                            <label className="text-sm font-medium text-gray-800">Hourly Leave</label>
                            {formData.is_hourly && (
                                <input
                                    type="number"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="8"
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                                    placeholder="Hours"
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-800 mb-2">Reason <span className="text-red-500">*</span></label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Briefly describe your reason for leave"
                            required
                        />
                    </div>
                </div>

                {/* Substitution Section - Integrated on same page */}
                <div className="border-t border-gray-200 pt-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Arrange Substitution</h3>
                    <p className="text-gray-600 mb-6">
                        Before submitting your leave request, you need to arrange for a colleague to substitute for you.
                        Search for a staff member in your department below.
                    </p>

                    {/* Substitution Status Messages */}
                    {substitutionStep === 'pending' && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                            <p className="text-gray-700">📝 Fill out substitution details and send request</p>
                        </div>
                    )}

                    {substitutionStep === 'requested' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-yellow-600 mr-3"></div>
                                <p className="text-yellow-700 font-medium">
                                    Substitution request sent! Waiting for approval... (Auto-refreshing)
                                </p>
                            </div>
                        </div>
                    )}

                    {substitutionStep === 'accepted' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center">
                                <span className="text-green-600 text-xl mr-2">✓</span>
                                <div>
                                    <p className="text-green-700 font-medium">Substitution approved by {selectedSubstitute?.requested_to_username}!</p>
                                    <p className="text-green-600 text-sm">You can now submit your leave request below.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {substitutionStep === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-red-600 text-xl mr-2">✗</span>
                                    <p className="text-red-700 font-medium">Substitution request was rejected.</p>
                                    <p className="text-red-600 text-sm">Please choose a different colleague.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleChooseAnotherSubstitute}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Choose Another
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Substitution Form - Only show if not accepted or it's time to select */}
                    {(substitutionStep === 'pending' || substitutionStep === 'searching' || substitutionStep === 'selected' || substitutionStep === 'rejected') && substitutionStep !== 'accepted' && substitutionStep !== 'requested' && (
                        <div className="space-y-4">
                            {/* Search Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-800 mb-2">1. Search for Substitute Teacher</h4>
                                <div className="flex space-x-4">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by username or email (department staff only)"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearchSubstitute()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchSubstitute}
                                        disabled={searching}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {searching ? 'Searching...' : 'Search'}
                                    </button>
                                </div>

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {searchResults.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleSubstituteSelect(user)}
                                                className={`p-3 cursor-pointer rounded-lg border hover:bg-blue-50 ${
                                                    selectedSubstitute?.id === user.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                                                }`}
                                            >
                                                <div className="font-medium">{user.username}</div>
                                                <div className="text-sm text-gray-600">{user.email} • {user.department}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Substitution Details */}
                            {selectedSubstitute && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-yellow-800 mb-2">2. Substitution Details</h4>
                                    <p className="text-yellow-700 mb-4">Selected: <strong>{selectedSubstitute.username}</strong></p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">Date <span className="text-red-500">*</span></label>
                                            <input
                                                type="date"
                                                name="date"
                                                value={substitutionData.date}
                                                onChange={handleSubstitutionChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">Period <span className="text-red-500">*</span></label>
                                            <select
                                                name="period"
                                                value={substitutionData.period}
                                                onChange={handleSubstitutionChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            >
                                                <option value="">Select Period</option>
                                                {periods.map(period => (
                                                    <option key={period} value={period}>{period}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-800 mb-1">Time <span className="text-red-500">*</span></label>
                                            <input
                                                type="time"
                                                name="time"
                                                value={substitutionData.time}
                                                onChange={handleSubstitutionChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-800 mb-1">Class/Subject <span className="text-gray-500">(Optional)</span></label>
                                        <input
                                            type="text"
                                            name="class_label"
                                            value={substitutionData.class_label}
                                            onChange={handleSubstitutionChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., CS101 Database Lecture, Period 3"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-800 mb-1">Message <span className="text-gray-500">(Optional)</span></label>
                                        <textarea
                                            name="message"
                                            value={substitutionData.message}
                                            onChange={handleSubstitutionChange}
                                            rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                            placeholder="Additional message for the substitute..."
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSubstitutionRequest}
                                            disabled={substitutionLoading}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                        >
                                            {substitutionLoading ? 'Sending Request...' : 'Send Substitution Request'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* PENDING REQUEST STATUS */}
                    {substitutionStep === 'requested' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">▶ Current Substitution Request</h4>
                            <p className="text-blue-700">
                                Sent to: <strong>{selectedSubstitute?.requested_to_username}</strong><br/>
                                Date: {substitutionData.date} at {substitutionData.time}<br/>
                                Period: {substitutionData.period}
                            </p>
                            <div className="mt-3 flex items-center space-x-2">
                                <div className="animate-pulse h-2 bg-blue-400 rounded-full flex-1"></div>
                                <span className="text-blue-600 text-sm">Waiting for response...</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button - Only enabled when substitution is accepted */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({ leave_type: '', start_date: '', end_date: '', reason: '', is_hourly: false, hours: 1 });
                            setSubstitutionStep('pending');
                            setSelectedSubstitute(null);
                            setSubstitutionData({ date: '', period: '', time: '', class_label: '', message: '' });
                        }}
                        className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Clear All
                    </button>
                    <button
                        type="submit"
                        disabled={leaveLoading || substitutionStep !== 'accepted'}
                        className="px-8 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    >
                        {leaveLoading ? 'Submitting...' :
                         substitutionStep !== 'accepted' ? 'Complete Substitution First' :
                         'Submit Leave Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LeaveForm;
