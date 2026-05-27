# Employee Management System (EMS)

A full-stack web app to manage employee records with React + Node.js/Express.

## Project Structure
```
ems/
├── backend/       ← Node.js + Express API (in-memory storage)
│   ├── server.js
│   └── package.json
└── frontend/      ← React JS app
    ├── public/
    └── src/
        ├── App.js / App.css
        ├── index.js / index.css
        └── components/
            ├── EmployeeTable.js + .css
            ├── EmployeeCards.js + .css
            ├── EmployeeForm.js
            ├── ConfirmDialog.js
            └── Toast.js
```

## Setup & Run

### Step 1 — Backend
```bash
cd ems/backend
npm install
node server.js
# Runs on http://localhost:5000
```

### Step 2 — Frontend (new terminal)
```bash
cd ems/frontend
npm install
npm start
# Opens http://localhost:3000
```

## Features

### ✅ All Modules Implemented
| Module | Details |
|--------|---------|
| **Add Employee** | Full form with validation — required fields, email format, numeric salary |
| **View Employees** | Table view + Card layout, toggle between them |
| **Update Employee** | Pre-filled form, edit any field, save changes |
| **Delete Employee** | Confirmation dialog before deleting, UI updates instantly |
| **Search** | Real-time search by name, email, or ID |
| **Filter** | Filter by department |
| **Stats Bar** | Live total employees, departments count, average salary |

### 🔌 REST API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | List all (supports `?search=` & `?department=`) |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### ✔️ Form Validation
- All fields required
- Email format validation (regex)
- Phone must be 10 digits
- Salary must be a positive number
- Duplicate email check (server-side)

## Tech Stack
- **Frontend**: React 18, React Hooks (useState, useEffect, useCallback), CSS Variables
- **Backend**: Node.js, Express, CORS
- **Storage**: In-memory (no DB setup needed; swap for MongoDB/Firebase easily)

## Extending to MongoDB
Replace the in-memory `employees` array in `server.js` with:
```js
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ems');
// Define Employee schema and use Model.find(), .save(), etc.
```
