import React from 'react';

function LeaveStats({ stats, balance }) {
    if (!stats || !balance) return <div>Loading statistics...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Leave Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Leaves</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Approved</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.approved_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-amber-600">{stats.pending_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Rejected</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.rejected_leaves}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave Balance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between"><span>Earned Leave:</span><span className="font-semibold">{balance.earned_leave} days</span></div>
                        <div className="flex justify-between"><span>Casual Leave:</span><span className="font-semibold">{balance.casual_leave} days</span></div>
                        <div className="flex justify-between"><span>Medical Leave:</span><span className="font-semibold">{balance.medical_leave} days</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LeaveStats;