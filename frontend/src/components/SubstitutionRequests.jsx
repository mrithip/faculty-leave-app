import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SubstitutionRequests() {
    const [requests, setRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('received');

    const fetchRequests = async () => {
        setLoading(true);
        const token = localStorage.getItem('access_token');

        try {
            const [receivedRes, sentRes] = await Promise.all([
                axios.get('/api/substitution/received_requests/', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('/api/substitution/sent_requests/', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setRequests(receivedRes.data);
            setSentRequests(sentRes.data);
        } catch (error) {
            toast.error('Failed to load requests');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (requestId, action) => {
        const token = localStorage.getItem('access_token');
        try {
            await axios.post(`/api/substitution/${requestId}/${action}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`Request ${action}d successfully!`);
            fetchRequests(); // Refresh the list
        } catch (error) {
            toast.error(`Failed to ${action} request`);
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-600 bg-yellow-100';
            case 'ACCEPTED': return 'text-green-600 bg-green-100';
            case 'REJECTED': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Substitution Requests</h2>

            {/* Tabs */}
            <div className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setActiveTab('received')}
                    className={`flex-1 py-2 px-4 rounded-md transition ${
                        activeTab === 'received'
                            ? 'bg-white shadow-sm font-semibold text-blue-600'
                            : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Received Requests ({requests.length})
                </button>
                <button
                    onClick={() => setActiveTab('sent')}
                    className={`flex-1 py-2 px-4 rounded-md transition ${
                        activeTab === 'sent'
                            ? 'bg-white shadow-sm font-semibold text-blue-600'
                            : 'text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Sent Requests ({sentRequests.length})
                </button>
            </div>

            {/* Received Requests */}
            {activeTab === 'received' && (
                <div className="space-y-4">
                    {requests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No pending substitution requests
                        </div>
                    ) : (
                        requests.map(request => (
                            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            From: {request.requested_by_username}
                                        </h3>
                                        <p className="text-gray-600">
                                            {formatDate(request.date)} • {request.period} • {request.time}
                                        </p>
                                        {request.message && (
                                            <p className="text-gray-700 mt-2 italic">"{request.message}"</p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>

                                {request.status === 'PENDING' && (
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleAction(request.id, 'accept')}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(request.id, 'reject')}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Sent Requests */}
            {activeTab === 'sent' && (
                <div className="space-y-4">
                    {sentRequests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No sent substitution requests
                        </div>
                    ) : (
                        sentRequests.map(request => (
                            <div key={request.id} className="bg-white p-6 rounded-lg shadow-md border">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            To: {request.requested_to_username}
                                        </h3>
                                        <p className="text-gray-600">
                                            {formatDate(request.date)} • {request.period} • {request.time}
                                        </p>
                                        {request.message && (
                                            <p className="text-gray-700 mt-2 italic">"{request.message}"</p>
                                        )}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                                        {request.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default SubstitutionRequests;
