import React, { useState } from 'react';

function PrincipalDepartmentSummary({ departmentSummary }) {
    const [sortField, setSortField] = useState('total_leaves');
    const [sortOrder, setSortOrder] = useState('desc');

    if (!departmentSummary || departmentSummary.length === 0) {
        return <div className="text-center py-8 text-gray-500">No department data available.</div>;
    }

    const sortedDepartments = [...departmentSummary].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (sortOrder === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (field) => {
        if (sortField !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const getApprovalRate = (dept) => {
        if (dept.total_leaves === 0) return 0;
        return (dept.approved_leaves / dept.total_leaves) * 100;
    };

    const getAverageLeavesPerStaff = (dept) => {
        if (dept.staff_count === 0) return 0;
        return (dept.total_leaves / dept.staff_count).toFixed(1);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Department Summary</h2>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Total Departments</h3>
                    <div className="text-3xl font-bold text-blue-600">{departmentSummary.length}</div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Total Staff</h3>
                    <div className="text-3xl font-bold text-green-600">
                        {departmentSummary.reduce((sum, dept) => sum + dept.staff_count, 0)}
                    </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Total HODs</h3>
                    <div className="text-3xl font-bold text-purple-600">
                        {departmentSummary.reduce((sum, dept) => sum + dept.hod_count, 0)}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mb-6">
                <table className="min-w-full bg-white rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('department')}
                            >
                                Department {getSortIcon('department')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('staff_count')}
                            >
                                Staff {getSortIcon('staff_count')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('hod_count')}
                            >
                                HODs {getSortIcon('hod_count')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('total_leaves')}
                            >
                                Total Leaves {getSortIcon('total_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('approved_leaves')}
                            >
                                Approved {getSortIcon('approved_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('pending_leaves')}
                            >
                                Pending {getSortIcon('pending_leaves')}
                            </th>
                            <th 
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
                                onClick={() => handleSort('rejected_leaves')}
                            >
                                Rejected {getSortIcon('rejected_leaves')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Approval Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Avg/Staff
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedDepartments.map((dept) => (
                            <tr key={dept.department} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{dept.department}</td>
                                <td className="px-6 py-4">{dept.staff_count}</td>
                                <td className="px-6 py-4">{dept.hod_count}</td>
                                <td className="px-6 py-4 font-medium">{dept.total_leaves}</td>
                                <td className="px-6 py-4">
                                    <span className="text-green-600 font-medium">{dept.approved_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-amber-600 font-medium">{dept.pending_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-red-600 font-medium">{dept.rejected_leaves}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${
                                        getApprovalRate(dept) >= 80 ? 'text-green-600' :
                                        getApprovalRate(dept) >= 50 ? 'text-amber-600' :
                                        'text-red-600'
                                    }`}>
                                        {getApprovalRate(dept).toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-blue-600 font-medium">
                                        {getAverageLeavesPerStaff(dept)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Most Active Department</h4>
                    {sortedDepartments.slice(0, 1).map((dept) => (
                        <div key={dept.department}>
                            <div className="text-lg font-bold text-blue-600">{dept.department}</div>
                            <div className="text-sm text-blue-800">{dept.total_leaves} leaves</div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Highest Approval Rate</h4>
                    {[...departmentSummary]
                        .filter(dept => dept.total_leaves > 0)
                        .sort((a, b) => getApprovalRate(b) - getApprovalRate(a))
                        .slice(0, 1)
                        .map((dept) => (
                        <div key={dept.department}>
                            <div className="text-lg font-bold text-green-600">{dept.department}</div>
                            <div className="text-sm text-green-800">{getApprovalRate(dept).toFixed(1)}%</div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Most Pending Leaves</h4>
                    {[...departmentSummary]
                        .sort((a, b) => b.pending_leaves - a.pending_leaves)
                        .slice(0, 1)
                        .map((dept) => (
                        <div key={dept.department}>
                            <div className="text-lg font-bold text-amber-600">{dept.department}</div>
                            <div className="text-sm text-amber-800">{dept.pending_leaves} pending</div>
                        </div>
                    ))}
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Highest Rejection Rate</h4>
                    {[...departmentSummary]
                        .filter(dept => dept.total_leaves > 0)
                        .sort((a, b) => (b.rejected_leaves / b.total_leaves) - (a.rejected_leaves / a.total_leaves))
                        .slice(0, 1)
                        .map((dept) => (
                        <div key={dept.department}>
                            <div className="text-lg font-bold text-red-600">{dept.department}</div>
                            <div className="text-sm text-red-800">
                                {((dept.rejected_leaves / dept.total_leaves) * 100).toFixed(1)}% rejected
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Department Performance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium">Total Leaves Across All Departments:</span>
                        <span className="ml-2 font-semibold">
                            {departmentSummary.reduce((sum, dept) => sum + dept.total_leaves, 0)}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium">Average Leaves per Department:</span>
                        <span className="ml-2 font-semibold">
                            {(departmentSummary.reduce((sum, dept) => sum + dept.total_leaves, 0) / departmentSummary.length).toFixed(1)}
                        </span>
                    </div>
                    <div>
                        <span className="font-medium">Overall Approval Rate:</span>
                        <span className="ml-2 font-semibold text-green-600">
                            {(
                                (departmentSummary.reduce((sum, dept) => sum + dept.approved_leaves, 0) / 
                                 departmentSummary.reduce((sum, dept) => sum + dept.total_leaves, 0)) * 100 || 0
                            ).toFixed(1)}%
                        </span>
                    </div>
                    <div>
                        <span className="font-medium">Total Staff Members:</span>
                        <span className="ml-2 font-semibold">
                            {departmentSummary.reduce((sum, dept) => sum + dept.staff_count, 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrincipalDepartmentSummary;