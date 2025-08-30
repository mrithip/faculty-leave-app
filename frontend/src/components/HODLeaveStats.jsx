import React from 'react';

function HODLeaveStats({ stats }) {
    if (!stats) {
        return (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700 font-medium">Loading department statistics...</p>
            </div>
        );
    }

    const statCards = [
        { title: "Total Leaves", value: stats.total_leaves, color: "text-blue-600", icon: "📚" },
        { title: "Approved", value: stats.approved_leaves, color: "text-green-600", icon: "✅" },
        { title: "Pending", value: stats.pending_leaves, color: "text-amber-600", icon: "⏳" },
        { title: "Rejected", value: stats.rejected_leaves, color: "text-red-600", icon: "❌" },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Department Leave Statistics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-200">
                        <div className={`text-4xl mb-3 ${card.color}`}>{card.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                        <p className={`text-4xl font-extrabold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Department Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Total Staff in Department:</span>
                        <span className="font-bold text-lg text-blue-700">{stats.staff_count}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Leaves per Staff (Avg):</span>
                        <span className="font-bold text-lg text-green-700">
                            {stats.staff_count > 0 ? (stats.total_leaves / stats.staff_count).toFixed(1) : 0}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Approval Rate:</span>
                        <span className="font-bold text-lg text-purple-700">
                            {stats.total_leaves > 0 ? ((stats.approved_leaves / stats.total_leaves) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-gray-700 font-medium">Pending Decisions:</span>
                        <span className="font-bold text-lg text-amber-700">{stats.pending_leaves}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HODLeaveStats;
