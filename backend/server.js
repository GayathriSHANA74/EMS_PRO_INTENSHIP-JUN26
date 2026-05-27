const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory database
let employees = [
  {
    id: 'EMP001',
    name: 'Alice Johnson',
    email: 'alice@company.com',
    phone: '9876543210',
    department: 'Engineering',
    designation: 'Senior Developer',
    salary: 95000,
    dateOfJoining: '2021-03-15',
  },
  {
    id: 'EMP002',
    name: 'Bob Martinez',
    email: 'bob@company.com',
    phone: '9123456780',
    department: 'Design',
    designation: 'UI/UX Designer',
    salary: 75000,
    dateOfJoining: '2022-07-01',
  },
  {
    id: 'EMP003',
    name: 'Carol Singh',
    email: 'carol@company.com',
    phone: '9000112233',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 82000,
    dateOfJoining: '2020-11-20',
  },
];

let idCounter = 4;

// GET all employees (with optional search/filter)
app.get('/api/employees', (req, res) => {
  const { search, department } = req.query;
  let result = [...employees];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
    );
  }
  if (department && department !== 'All') {
    result = result.filter((e) => e.department === department);
  }
  res.json(result);
});

// GET single employee
app.get('/api/employees/:id', (req, res) => {
  const emp = employees.find((e) => e.id === req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json(emp);
});

// POST create employee
app.post('/api/employees', (req, res) => {
  const { name, email, phone, department, designation, salary, dateOfJoining } = req.body;

  // Validation
  if (!name || !email || !phone || !department || !designation || !salary || !dateOfJoining) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (isNaN(Number(salary)) || Number(salary) <= 0) {
    return res.status(400).json({ error: 'Salary must be a positive number' });
  }
  if (employees.find((e) => e.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newEmp = {
    id: `EMP${String(idCounter++).padStart(3, '0')}`,
    name,
    email,
    phone,
    department,
    designation,
    salary: Number(salary),
    dateOfJoining,
  };
  employees.push(newEmp);
  res.status(201).json(newEmp);
});

// PUT update employee
app.put('/api/employees/:id', (req, res) => {
  const idx = employees.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });

  const { name, email, phone, department, designation, salary, dateOfJoining } = req.body;

  if (!name || !email || !phone || !department || !designation || !salary || !dateOfJoining) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  if (isNaN(Number(salary)) || Number(salary) <= 0) {
    return res.status(400).json({ error: 'Salary must be a positive number' });
  }
  const emailConflict = employees.find((e) => e.email === email && e.id !== req.params.id);
  if (emailConflict) {
    return res.status(400).json({ error: 'Email already used by another employee' });
  }

  employees[idx] = {
    ...employees[idx],
    name, email, phone, department, designation,
    salary: Number(salary),
    dateOfJoining,
  };
  res.json(employees[idx]);
});

// DELETE employee
app.delete('/api/employees/:id', (req, res) => {
  const idx = employees.findIndex((e) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Employee not found' });
  employees.splice(idx, 1);
  res.json({ message: 'Employee deleted successfully' });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`EMS Backend running on http://localhost:${PORT}`));
