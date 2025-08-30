import React from 'react';

function LeaveStats({ stats, balance }) {
    if (!stats || !balance) {
        return (
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-700 font-medium">Loading leave statistics...</p>
            </div>
        );
    }

    const statCards = [
        { title: "Total Leaves", value: stats.total_leaves, color: "text-blue-600", icon: "📚" },
        { title: "Approved", value: stats.approved_leaves, color: "text-green-600", icon: "✅" },
        { title: "Pending", value: stats.pending_leaves, color: "text-amber-600", icon: "⏳" },
        { title: "Rejected", value: stats.rejected_leaves, color: "text-red-600", icon: "❌" },
    ];

    const leaveBalanceItems = [
        { label: "Earned Leave", value: balance.earned_leave, unit: "days", color: "text-indigo-600" },
        { label: "Casual Leave", value: balance.casual_leave, unit: "days", color: "text-teal-600" },
        { label: "Medical Leave", value: balance.medical_leave, unit: "days", color: "text-purple-600" },
        { label: "Compensatory Leave", value: balance.compensatory_leave, unit: "days", color: "text-pink-600" },
        { label: "Night Work Credits", value: balance.night_work_credits, unit: "credits", color: "text-yellow-600" },
    ];

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-4xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">My Leave Statistics</h2>
            
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
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Leave Balance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaveBalanceItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <span className="text-gray-700 font-medium">{item.label}:</span>
                            <span className={`font-bold text-lg ${item.color}`}>{item.value} {item.unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LeaveStats;
