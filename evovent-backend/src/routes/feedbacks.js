const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/event/:eventId', feedbackController.getFeedbacksByEventId);
router.get('/:id', feedbackController.getFeedbackById);
router.post('/feedbacks', feedbackController.createFeedback);
router.put('/:id', feedbackController.updateFeedback);
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
