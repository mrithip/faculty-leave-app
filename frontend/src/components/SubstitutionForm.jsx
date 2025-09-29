import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SubstitutionForm({ prefilledDate, onSubstitutionComplete }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        date: prefilledDate || '',
        period: '',
        time: '',
        class_label: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Update form data when prefilledDate changes
    useEffect(() => {
        if (prefilledDate) {
            setFormData(prev => ({ ...prev, date: prefilledDate }));
        }
    }, [prefilledDate]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            toast.warning('Please enter a search query');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`/api/substitution/search_users/?q=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                toast.info('No staff members found in your department matching the search');
            }
        } catch (error) {
            toast.error('Search failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            toast.error('Please select a user');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/api/substitution/', {
                ...formData,
                requested_to: selectedUser.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Substitution request sent successfully!');
            setFormData({ date: '', period: '', time: '', class_label: '', message: '' });
            setSelectedUser(null);
            setSearchResults([]);
            setSearchQuery('');

            // Call completion callback
            if (onSubstitutionComplete) {
                onSubstitutionComplete();
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to send request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedUser(null);
    };

    const periods = [
        'Morning Session',
        'Afternoon Session',
        'Evening Session',
        'Full Day',
        'Period 1',
        'Period 2',
        'Period 3',
        'Period 4'
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Substitution Request</h2>

            {/* Search Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Search for Staff Member</h3>
                <p className="text-sm text-gray-600 mb-4">You can only search for other staff members in your department.</p>
                <div className="flex space-x-4 mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by username or email (department staff only)"
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                    <button
                        onClick={clearSearch}
                        className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Clear
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-semibold mb-3">Select Staff Member:</h4>
                        <div className="space-y-2">
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className={`p-3 cursor-pointer rounded-lg border hover:bg-blue-50 ${
                                        selectedUser?.id === user.id ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="font-medium">{user.username}</div>
                                    <div className="text-sm text-gray-600">{user.email} • {user.department}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {selectedUser && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <strong>Selected: {selectedUser.username}</strong> ({selectedUser.email})
                    </div>
                )}
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Period/Session <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="period"
                            value={formData.period}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Period</option>
                            {periods.map(period => (
                                <option key={period} value={period}>{period}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Class/Subject/Period Label <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        name="class_label"
                        value={formData.class_label}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., CS101 Database Lecture, Period 3, Lab Session"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Message (Optional)
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add any additional message for the substitute..."
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => {
                            setFormData({ date: '', period: '', time: '', class_label: '', message: '' });
                            setSelectedUser(null);
                        }}
                        className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        disabled={submitting || !selectedUser}
                        className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {submitting ? 'Sending...' : 'Send Substitution Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SubstitutionForm;
