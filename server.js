const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Show server timezone and date on startup
const serverDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
console.log(`Server started on port ${PORT}`);
console.log(`Server timezone: Asia/Kolkata`);
console.log(`Server date: ${serverDate}`);

// Helper functions
const readStudents = () => {
  try {
    return JSON.parse(fs.readFileSync('students.json', 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeStudents = (students) => {
  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));
};

// GET /students
app.get('/students', (req, res) => {
  res.json(readStudents());
});

// POST /students
app.post('/students', (req, res) => {
  const { name, dob } = req.body;
  
  if (!name || !dob) {
    return res.status(400).json({ error: 'Name and dob are required' });
  }
  
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return res.status(400).json({ error: 'DOB must be in YYYY-MM-DD format' });
  }
  
  const students = readStudents();
  const newId = Math.max(...students.map(s => s.id), 0) + 1;
  const newStudent = { id: newId, name, dob };
  
  students.push(newStudent);
  writeStudents(students);
  
  res.status(201).json(newStudent);
});

// DELETE /students/:id
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const students = readStudents();
  const filteredStudents = students.filter(s => s.id !== id);
  
  if (students.length === filteredStudents.length) {
    return res.status(404).json({ error: 'Student not found' });
  }
  
  writeStudents(filteredStudents);
  res.json({ message: 'Student deleted' });
});

// GET /check-today
app.get('/check-today', (req, res) => {
  const students = readStudents();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
  const [todayYear, todayMonth, todayDay] = today.split('-');
  
  const birthdays = students.filter(student => {
    const [dobYear, dobMonth, dobDay] = student.dob.split('-');
    return dobMonth === todayMonth && dobDay === todayDay;
  });
  
  res.json(birthdays);
});

app.listen(PORT, () => {
  console.log(`Visit http://localhost:${PORT} to see the homepage`);
});