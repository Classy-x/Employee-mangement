# Architecture & System Design

**Project:** Employee Management System  
**Stack:** React 19, Tailwind CSS v4, Express.js, PostgreSQL  

---

## 1. Frontend Structure

```
src/
├── main.jsx                     # Entry point
├── App.jsx                      # Central state & container
├── index.css                    # Tailwind v4 directives
├── services/
│   └── employeeService.js       # API calls & data normalization
└── components/
    ├── layout/
    │   └── Navbar.jsx           # Top header & Add action
    ├── employees/
    │   ├── EmployeeTable.jsx    # Table with status toggle & actions
    │   ├── EmployeeFilters.jsx  # Search & status filter tabs
    │   ├── EmployeeFormModal.jsx# Add / Edit form modal
    │   ├── EmptyState.jsx       # Zero-data feedback
    │   └── ErrorState.jsx       # Error screen with retry
    └── common/
        ├── Button.jsx           # Button component
        ├── Badge.jsx            # Status badge (Active / Inactive)
        ├── FormField.jsx        # Label, input wrapper & error message
        ├── Modal.jsx            # Base modal dialog
        ├── ConfirmDialog.jsx    # Delete confirmation dialog
        ├── LoadingSpinner.jsx   # Loading state indicator
        └── Toast.jsx            # Action notifications
```

### State Management & Normalization
- **Centralized State (`App.jsx`):** Manages `employees`, `loading`, `searchQuery`, `statusFilter`, and modal states.
- **Normalization (`employeeService.js`):** Maps backend columns (`full_name`, `employee_id`) to frontend properties (`name`, `id`).

---

## 2. API Contract (`http://localhost:8080/api/employee`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employee` | Fetch all records (supports `?search=` and `?status=`) |
| `GET` | `/api/employee/:id` | Fetch single record for edit form |
| `POST` | `/api/employee` | Create employee (`full_name`, `email`, `department`, `designation`, `status`) |
| `PUT` | `/api/employee/:id` | Update employee record |
| `DELETE` | `/api/employee/:id` | Delete employee record |

---

## 3. Implemented Features

- **CRUD:** Complete Add, Edit (pre-fetched via `GET /:id`), Delete with confirmation, and View.
- **Search & Filters:** Real-time search across Name/Email, status filtering (`All`, `Active`, `Inactive`) with counter badges.
- **Quick Status Toggle:** In-row click on status badge with inline loader.
- **UX Feedback:** In-table loading spinners, modal loading overlays, auto-hiding toasts, and error retry state.

---

## 4. Incomplete & Future Features

- **Server-Side Pagination:** Add `page` and `limit` on API (`LIMIT $1 OFFSET $2`) for large datasets.
- **Server-Side Search Debounce:** Delegate debounced search to backend `ILIKE` queries when pagination is active.
- **Relational Departments:** Dedicated `/api/departments` entity instead of hardcoded/free-text values.
- **Authentication & RBAC:** User login, JWT sessions, and role permissions (Admin, Manager, Viewer).
- **Bulk Operations:** Multi-row select for batch status updates, batch deletion, and CSV export.
- **Avatar Upload:** Profile picture upload support via `multipart/form-data`.
