import React from 'react';

function HODStaffList({ staffList }) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 max-w-6xl mx-auto my-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Department Staff List</h2>
            
            {staffList.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-5xl mb-4">👥</div>
                    <p className="text-xl font-medium">No staff members found in your department.</p>
                    <p className="text-gray-600 mt-2">Please ensure staff data is correctly loaded.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Earned Leave</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Casual Leave</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Medical Leave</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Night Work Credits</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Compensatory Leave</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{staff.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 text-sm">{staff.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            staff.leave_balance.earned_leave > 5 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.earned_leave > 2 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.earned_leave} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            staff.leave_balance.casual_leave > 8 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.casual_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.casual_leave} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            staff.leave_balance.medical_leave > 8 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.medical_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.medical_leave} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            staff.leave_balance.night_work_credits > 5 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.night_work_credits > 2 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.night_work_credits} credits
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            staff.leave_balance.compensatory_leave > 5 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.compensatory_leave > 2 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.compensatory_leave} days
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {staffList.length > 0 && (
                <div className="mt-10 p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Department Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
                            <div className="text-4xl font-extrabold text-blue-700 mb-2">{staffList.length}</div>
                            <div className="text-sm text-gray-700 font-medium">Total Staff</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
                            <div className="text-4xl font-extrabold text-green-700 mb-2">
                                {staffList.reduce((sum, staff) => sum + staff.leave_balance.earned_leave, 0)}
                            </div>
                            <div className="text-sm text-gray-700 font-medium">Total Earned Leave Days</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center text-center">
                            <div className="text-4xl font-extrabold text-amber-700 mb-2">
                                {(staffList.reduce((sum, staff) => sum + staff.leave_balance.earned_leave, 0) / staffList.length).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-700 font-medium">Avg. Earned Leave per Staff</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HODStaffList;
