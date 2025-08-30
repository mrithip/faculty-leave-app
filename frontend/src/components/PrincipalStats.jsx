import React from 'react';

function PrincipalStats({ stats }) {
    if (!stats) {
        return (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700 font-medium">Loading institutional statistics...</p>
            </div>
        );
    }

    const statCards = [
        { title: "Total Leaves", value: stats.total_stats.total_leaves, color: "text-blue-600", icon: "📚" },
        { title: "Approved", value: stats.total_stats.approved_leaves, color: "text-green-600", icon: "✅" },
        { title: "Pending", value: stats.total_stats.pending_leaves, color: "text-amber-600", icon: "⏳" },
        { title: "Rejected", value: stats.total_stats.rejected_leaves, color: "text-red-600", icon: "❌" },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-6xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Institutional Overview</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-200">
                        <div className={`text-4xl mb-3 ${card.color}`}>{card.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{card.title}</h3>
                        <p className={`text-4xl font-extrabold ${card.color}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Overall Approval Rate</h3>
                    <div className="text-center">
                        <div className="text-5xl font-extrabold text-green-700 mb-3">
                            {stats.total_stats.approval_rate.toFixed(1)}%
                        </div>
                        <p className="text-md text-gray-700">Percentage of leaves approved across the institution.</p>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Recent Activity</h3>
                    <div className="space-y-3">
                        {stats.recent_activity.length === 0 ? (
                            <p className="text-center text-gray-600">No recent activity to display.</p>
                        ) : (
                            stats.recent_activity.slice(0, 5).map((activity, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <span className="text-gray-800 font-medium">{activity.staff_name}</span>
                                    <span className="text-green-600 font-semibold">Approved</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default PrincipalStats;
