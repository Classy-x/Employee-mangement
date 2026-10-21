const API_BASE_URL = 'http://localhost:8080/api/employee';

const normalizeEmployee = (emp) => ({
  id: emp.id || emp.employee_id || emp.employeeId,
  name: emp.full_name || emp.name || emp.fullName || '',
  full_name: emp.full_name || emp.name || emp.fullName || '',
  email: emp.email || '',
  department: emp.department || '',
  designation: emp.designation || '',
  status: emp.status || 'Active'
});

export const employeeService = {
  async getEmployees(params = {}) {
    const url = new URL(API_BASE_URL);

    if (params.search && params.search.trim()) {
      url.searchParams.set('search', params.search.trim());
    }
    if (params.status && params.status !== 'ALL') {
      url.searchParams.set('status', params.status);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch employees (HTTP ${response.status})`);
    }

    const data = await response.json();
    const list = Array.isArray(data) ? data : data.data || [];
    return list.map(normalizeEmployee);
  },

  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to fetch employee #${id}`);
    }

    const data = await response.json();
    return normalizeEmployee(data);
  },

  async createEmployee(data) {
    const payload = {
      full_name: (data.name || data.full_name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      department: (data.department || '').trim(),
      designation: (data.designation || '').trim(),
      status: data.status || 'Active'
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to create employee (HTTP ${response.status})`);
    }

    const created = await response.json();
    return normalizeEmployee(created);
  },

  async updateEmployee(id, data) {
    const payload = {
      full_name: (data.name || data.full_name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      department: (data.department || '').trim(),
      designation: (data.designation || '').trim(),
      status: data.status || 'Active'
    };

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to update employee #${id} (HTTP ${response.status})`);
    }

    const updated = await response.json();
    return normalizeEmployee(updated);
  },

  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      throw new Error(err?.message || `Failed to delete employee #${id}`);
    }

    return await response.json();
  }
};
