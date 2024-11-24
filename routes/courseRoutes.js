const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../courses.json');

// Helper functions
const readData = () => {
  const data = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
};

// Routes

// GET all courses
router.get('/', (req, res) => {
  const courses = readData();
  res.json(courses);
});

// GET course by ID
router.get('/:id', (req, res) => {
  const courses = readData();
  const course = courses.find((c) => c.id === req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

// POST add a new course
router.post('/', (req, res) => {
  const courses = readData();
  const newCourse = { id: uuidv4(), ...req.body };

  courses.push(newCourse);
  writeData(courses);

  res.status(201).json(newCourse);
});

// PUT update a course
router.put('/:id', (req, res) => {
  const courses = readData();
  const courseIndex = courses.findIndex((c) => c.id === req.params.id);

  if (courseIndex !== -1) {
    const updatedCourse = { ...courses[courseIndex], ...req.body };
    courses[courseIndex] = updatedCourse;

    writeData(courses);
    res.json(updatedCourse);
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

// DELETE a course
router.delete('/:id', (req, res) => {
  const courses = readData();
  const updatedCourses = courses.filter((c) => c.id !== req.params.id);

  if (courses.length !== updatedCourses.length) {
    writeData(updatedCourses);
    res.json({ message: 'Course deleted' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

module.exports = router;
