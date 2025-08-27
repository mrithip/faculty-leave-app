import React from 'react';

function HODStaffList({ staffList }) {
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Staff List - Department Members</h2>
            
            {staffList.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No staff found in your department.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Earned Leave</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Casual Leave</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medical Leave</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {staffList.map((staff) => (
                                <tr key={staff.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{staff.username}</td>
                                    <td className="px-6 py-4 text-blue-600">{staff.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            staff.leave_balance.earned_leave > 5 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.earned_leave > 2 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.earned_leave} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            staff.leave_balance.casual_leave > 8 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.casual_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.casual_leave} days
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            staff.leave_balance.medical_leave > 8 ? 'bg-green-100 text-green-800' : 
                                            staff.leave_balance.medical_leave > 4 ? 'bg-amber-100 text-amber-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {staff.leave_balance.medical_leave} days
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {staffList.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Department Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{staffList.length}</div>
                            <div className="text-sm text-gray-600">Total Staff</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {staffList.reduce((sum, staff) => sum + staff.leave_balance.earned_leave, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Total Earned Leave Days</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-amber-600">
                                {(staffList.reduce((sum, staff) => sum + staff.leave_balance.earned_leave, 0) / staffList.length).toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">Avg. Earned Leave per Staff</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HODStaffList;