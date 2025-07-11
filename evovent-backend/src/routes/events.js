const express = require('express');
const { getEvents, createEvent, updateEvent, deleteEvent, getEventById, getEventsByUserId } = require('../controllers/eventController');
const multer = require('multer');
const { storage } = require('../multerConfig');
const upload = multer({ storage });
const router = express.Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', upload.single('image'), createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/user/:userId/events', getEventsByUserId);

module.exports = router;
