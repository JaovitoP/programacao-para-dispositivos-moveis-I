const express = require('express');
const {
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
  getReservationsByUserId,
  getReservationsByEventId,
  updateReservationStatus,
  validateTicket
} = require('../controllers/reservationController');

const router = express.Router();

router.get('/reservations', getReservations);
router.get('/reservations/:id', getReservationById);
router.post('/reservations', createReservation);
router.put('/reservations/:id', updateReservation);
router.delete('/reservations/:id', deleteReservation);

router.get('/users/:user_id/reservations', getReservationsByUserId);
router.get('/events/:event_id/reservations', getReservationsByEventId);
router.patch('/reservations/:id/status', updateReservationStatus);
router.post('/reservations/validate/:id', validateTicket);
module.exports = router;