# Employee Management API

RESTful API built with Node.js, Express, and PostgreSQL to manage employee records.

---

## Technology Stack

- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- Database Client: pg
- Middleware: cors
- Environment Management: dotenv

---

## Database Schema

Table name: `employee`

```sql
CREATE TABLE employee (
  employee_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  department VARCHAR(100),
  designation VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
);
```

### Fields

| Field | Database Column | Type | Constraints |
| :--- | :--- | :--- | :--- |
| Employee ID | `employee_id` | INTEGER | Primary Key, Auto-increment |
| Full Name | `full_name` | VARCHAR(255) | NOT NULL |
| Email | `email` | VARCHAR(255) | NOT NULL, UNIQUE |
| Department | `department` | VARCHAR(100) | |
| Designation | `designation` | VARCHAR(100) | |
| Status | `status` | VARCHAR(20) | NOT NULL, Default 'Active' |

---

## Configuration (.env)

```env
PORT=8080
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=employee_db
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## Getting Started

Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm start
```

---

## API Endpoints

Base URL: `http://localhost:8080/api`

### 1. Retrieve All Employees
- Method: `GET`
- Path: `/api/employee`
- Query Parameters:
  - `search`: string
  - `status`: Active or Inactive

Response:
```json
[
  {
    "employee_id": 1,
    "id": 1,
    "full_name": "John Doe",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "designation": "Software Engineer",
    "status": "Active"
  }
]
```

### 2. Retrieve Employee by ID
- Method: `GET`
- Path: `/api/employee/:id`

Response:
```json
{
  "employee_id": 1,
  "id": 1,
  "full_name": "John Doe",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Software Engineer",
  "status": "Active"
}
```

### 3. Create Employee
- Method: `POST`
- Path: `/api/employee`

Request Body:
```json
{
  "full_name": "Sarah Jenkins",
  "email": "sarah.jenkins@acme.corp",
  "department": "Engineering",
  "designation": "Frontend Developer",
  "status": "Active"
}
```

Response:
```json
{
  "employee_id": 2,
  "id": 2,
  "full_name": "Sarah Jenkins",
  "name": "Sarah Jenkins",
  "email": "sarah.jenkins@acme.corp",
  "department": "Engineering",
  "designation": "Frontend Developer",
  "status": "Active"
}
```

### 4. Update Employee
- Method: `PUT`
- Path: `/api/employee/:id`

Request Body:
```json
{
  "full_name": "Johnathan Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "status": "Active"
}
```

Response:
```json
{
  "employee_id": 1,
  "id": 1,
  "full_name": "Johnathan Doe",
  "name": "Johnathan Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "designation": "Senior Software Engineer",
  "status": "Active"
}
```

### 5. Delete Employee
- Method: `DELETE`
- Path: `/api/employee/:id`

Response:
```json
{
  "success": true,
  "message": "Employee deleted successfully",
  "id": 1,
  "employee_id": 1
}
```

---

## Project Structure

```
Employee Management Api/
├── app/
│   ├── config/
│   │   └── db.config.js
│   ├── controllers/
│   │   └── employee.controller.js
│   └── routes/
│       └── employee.routes.js
├── .env
├── package.json
├── README.md
└── server.js
```
