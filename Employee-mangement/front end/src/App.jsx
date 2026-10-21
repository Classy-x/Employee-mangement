import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { employeeService } from './services/employeeService';
import { Navbar } from './components/layout/Navbar';
import { EmployeeFilters } from './components/employees/EmployeeFilters';
import { EmployeeTable } from './components/employees/EmployeeTable';
import { EmployeeFormModal } from './components/employees/EmployeeFormModal';
import { ConfirmDialog } from './components/common/ConfirmDialog';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { EmptyState } from './components/employees/EmptyState';
import { ErrorState } from './components/employees/ErrorState';
import { Toast } from './components/common/Toast';

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [isSearching, setIsSearching] = useState(false);
  const [isFilteringStatus, setIsFilteringStatus] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deletingEmployee, setDeletingEmployee] = useState(null);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch employee records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setIsSearching(true);
  };

  useEffect(() => {
    if (!isSearching) return;
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, isSearching]);

  const handleStatusChange = (newStatus) => {
    if (newStatus === statusFilter) return;
    setIsFilteringStatus(true);
    setStatusFilter(newStatus);
    setTimeout(() => {
      setIsFilteringStatus(false);
    }, 250);
  };

  const handleSaveEmployee = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEmployee) {
        const updated = await employeeService.updateEmployee(editingEmployee.id, formData);
        setEmployees((prev) =>
          prev.map((emp) => (emp.id === updated.id ? updated : emp))
        );
        showToast(`Successfully updated ${updated.name}`, 'success');
      } else {
        const created = await employeeService.createEmployee(formData);
        setEmployees((prev) => [created, ...prev]);
        showToast(`Successfully added ${created.name}`, 'success');
      }
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (err) {
      showToast(err.message || 'Error saving employee data.', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    setIsDeleting(true);
    try {
      await employeeService.deleteEmployee(deletingEmployee.id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== deletingEmployee.id));
      showToast(`Removed ${deletingEmployee.name} from records`, 'success');
      setDeletingEmployee(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (employee) => {
    const nextStatus = employee.status === 'Active' ? 'Inactive' : 'Active';
    setActionLoadingId(employee.id);
    try {
      const updated = await employeeService.updateEmployee(employee.id, {
        ...employee,
        status: nextStatus
      });
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === updated.id ? updated : emp))
      );
      showToast(`Changed ${employee.name}'s status to ${nextStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update employee status.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        (employee.name && employee.name.toLowerCase().includes(query)) ||
        (employee.full_name && employee.full_name.toLowerCase().includes(query)) ||
        (employee.email && employee.email.toLowerCase().includes(query)) ||
        (employee.id !== undefined && String(employee.id).toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === 'ALL' || employee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'Active').length;
    const inactive = employees.filter((e) => e.status === 'Inactive').length;
    return { total, active, inactive };
  }, [employees]);

  const openAddModal = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const openEditModal = async (employee) => {
    setActionLoadingId(employee.id);
    try {
      const details = await employeeService.getEmployeeById(employee.id);
      setEditingEmployee(details);
      setIsFormOpen(true);
    } catch (err) {
      showToast(err.message || 'Failed to fetch employee details.', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const closeFormModal = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
  };

  const isFilterActive = searchQuery.trim() !== '' || statusFilter !== 'ALL';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onAddEmployee={openAddModal} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        <EmployeeFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          stats={stats}
        />

        {loading || isFilteringStatus || isSearching ? (
          <LoadingSpinner
            message={
              isSearching
                ? 'Searching employees...'
                : isFilteringStatus
                ? 'Filtering employees...'
                : 'Loading employees...'
            }
          />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchEmployees} />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState
            isFilterActive={isFilterActive}
            onClearFilters={clearFilters}
            onAddEmployee={openAddModal}
          />
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onEdit={openEditModal}
            onDelete={setDeletingEmployee}
            onToggleStatus={handleToggleStatus}
            actionLoadingId={actionLoadingId}
          />
        )}
      </main>

      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={closeFormModal}
        onSubmit={handleSaveEmployee}
        initialData={editingEmployee}
        isSubmitting={isSubmitting}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleDeleteEmployee}
        itemName={deletingEmployee?.name}
        isDeleting={isDeleting}
      />

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toast && <Toast toast={toast} onClose={closeToast} />}
      </div>
    </div>
  );
}

export default App;
