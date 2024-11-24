const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../students.json');

// Helper functions
const readData = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Routes

// GET all students
router.get('/', (req, res) => {
  const students = readData();
  res.json(students);
});

// GET student by ID
router.get('/:id', (req, res) => {
  const students = readData();
  const student = students.find((s) => s.id === req.params.id);

  if (student) {
    res.json(student);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// POST add a new student
router.post('/', (req, res) => {
  const students = readData();
  const newStudent = { id: uuidv4(), ...req.body };

  students.push(newStudent);
  writeData(students);

  res.status(201).json(newStudent);
});

// PUT update a student
router.put('/:id', (req, res) => {
  const students = readData();
  const studentIndex = students.findIndex((s) => s.id === req.params.id);

  if (studentIndex !== -1) {
    const updatedStudent = { ...students[studentIndex], ...req.body };
    students[studentIndex] = updatedStudent;

    writeData(students);
    res.json(updatedStudent);
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

// DELETE a student
router.delete('/:id', (req, res) => {
  const students = readData();
  const updatedStudents = students.filter((s) => s.id !== req.params.id);

  if (students.length !== updatedStudents.length) {
    writeData(updatedStudents);
    res.json({ message: 'Student deleted' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});

module.exports = router;
