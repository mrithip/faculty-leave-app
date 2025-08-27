import React from 'react';

function HODLeaveStats({ stats }) {
    if (!stats) return <div className="text-center py-8 text-gray-500">Loading department statistics...</div>;

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">Department Leave Statistics</h2>
            
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

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Total Staff in Department:</span>
                        <span className="font-semibold">{stats.staff_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Leaves per Staff (Avg):</span>
                        <span className="font-semibold">
                            {stats.staff_count > 0 ? (stats.total_leaves / stats.staff_count).toFixed(1) : 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Approval Rate:</span>
                        <span className="font-semibold">
                            {stats.total_leaves > 0 ? ((stats.approved_leaves / stats.total_leaves) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-gray-600">Pending Decisions:</span>
                        <span className="font-semibold">{stats.pending_leaves}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HODLeaveStats;