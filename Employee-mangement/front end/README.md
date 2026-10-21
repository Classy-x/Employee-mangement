# Employee Management System

A clean, responsive frontend application built with React and Tailwind CSS for managing employee records, integrated with an Express.js and PostgreSQL REST API backend.

## Features

- **Employee Directory**: Displays team members in a table showing Full Name, Email, Department, Designation, and Status.
- **Add Employee**: Modal form with validation for required fields before submitting to the database.
- **Edit Employee**: Fetches individual record details via `GET /api/employee/:id` and updates the entry.
- **Delete with Confirmation**: Dialog modal with action loader to prevent accidental deletions.
- **Live Search**: Instant search by employee name with an integrated table loading state.
- **Status Filter**: Tab filters (`All`, `Active`, `Inactive`) with counts and table loader.
- **Quick Status Toggle**: Click on any status badge in the table to toggle between Active and Inactive.
- **State Handling**: Feedback for loading states, empty searches/databases, error handling with retry, and toast notifications.

## Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** (icons)

## API Endpoints

The frontend connects to the backend REST API at `http://localhost:8080/api/employee`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/employee` | Retrieve all employees (supports `?search=` and `?status=`) |
| `GET` | `/api/employee/:id` | Retrieve specific employee details for editing |
| `POST` | `/api/employee` | Create a new employee |
| `PUT` | `/api/employee/:id` | Update an existing employee |
| `DELETE` | `/api/employee/:id` | Delete an employee |

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend API server running on `http://localhost:8080`

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```
