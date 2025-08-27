import React from 'react';

function PrincipalStats({ stats }) {
    if (!stats) return <div className="text-center py-8 text-gray-500">Loading statistics...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Institutional Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Leaves</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.total_stats.total_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Approved</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.total_stats.approved_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending</h3>
                    <p className="text-3xl font-bold text-amber-600">{stats.total_stats.pending_leaves}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Rejected</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.total_stats.rejected_leaves}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Approval Rate</h3>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                            {stats.total_stats.approval_rate.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Overall approval rate</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                        {stats.recent_activity.slice(0, 5).map((activity, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <span>{activity.staff_name}</span>
                                <span className="text-green-600">Approved</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrincipalStats;