import React from 'react';

function StaffLeaveBalanceTable({ balance }) {
    if (!balance) {
        return <div className="text-center py-8 text-gray-500">Loading leave balance...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Your Leave Balance</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Earned Leave</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    balance.earned_leave > 5 ? 'bg-green-100 text-green-800' : 
                                    balance.earned_leave > 2 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {balance.earned_leave} days
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Casual Leave</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    balance.casual_leave > 8 ? 'bg-green-100 text-green-800' : 
                                    balance.casual_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {balance.casual_leave} days
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Medical Leave</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    balance.medical_leave > 8 ? 'bg-green-100 text-green-800' : 
                                    balance.medical_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {balance.medical_leave} days
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Night Work Credits</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    balance.night_work_credits > 5 ? 'bg-green-100 text-green-800' : 
                                    balance.night_work_credits > 2 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {balance.night_work_credits} credits
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">Compensatory Leave</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    balance.compensatory_leave > 5 ? 'bg-green-100 text-green-800' : 
                                    balance.compensatory_leave > 2 ? 'bg-amber-100 text-amber-800' : 
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {balance.compensatory_leave} days
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StaffLeaveBalanceTable;
