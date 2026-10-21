import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';

export const EmployeeTable = ({
  employees,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoadingId = null
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <th scope="col" className="py-3 px-4">Full Name</th>
              <th scope="col" className="py-3 px-4">Email</th>
              <th scope="col" className="py-3 px-4">Department</th>
              <th scope="col" className="py-3 px-4">Designation</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((employee) => {
              const isActive = employee.status === 'Active';
              const isRowLoading = actionLoadingId === employee.id;

              return (
                <tr key={employee.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-gray-900">
                    {employee.name}
                  </td>

                  <td className="py-3.5 px-4 text-gray-600">
                    {employee.email}
                  </td>

                  <td className="py-3.5 px-4 text-gray-700">
                    {employee.department}
                  </td>

                  <td className="py-3.5 px-4 text-gray-700">
                    {employee.designation}
                  </td>

                  <td className="py-3.5 px-4">
                    {onToggleStatus ? (
                      <button
                        type="button"
                        onClick={() => onToggleStatus(employee)}
                        disabled={isRowLoading}
                        title={`Click to switch status to ${isActive ? 'Inactive' : 'Active'}`}
                        className="cursor-pointer group inline-flex items-center"
                      >
                        {isRowLoading ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-300">
                            <span className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </span>
                        ) : (
                          <Badge
                            variant={isActive ? 'success' : 'neutral'}
                            showDot={true}
                            className="group-hover:opacity-80 transition-opacity"
                          >
                            {employee.status}
                          </Badge>
                        )}
                      </button>
                    ) : (
                      <Badge variant={isActive ? 'success' : 'neutral'} showDot={true}>
                        {employee.status}
                      </Badge>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        type="button"
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                        title={`Edit ${employee.name}`}
                        onClick={() => onEdit(employee)}
                        disabled={isRowLoading}
                        aria-label={`Edit ${employee.name}`}
                      >
                        {isRowLoading ? (
                          <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                          <Pencil size={15} />
                        )}
                      </button>
                      <button
                        type="button"
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        title={`Delete ${employee.name}`}
                        onClick={() => onDelete(employee)}
                        aria-label={`Delete ${employee.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Showing <span className="font-medium text-gray-800">{employees.length}</span> {employees.length === 1 ? 'employee' : 'employees'}
      </div>
    </div>
  );
};
