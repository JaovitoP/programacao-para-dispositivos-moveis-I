const express = require('express');
const { 
  getTickets, 
  getEventTickets, 
  getTicketsByEventId,
  getTicketById, 
  createTicket, 
  updateTicket, 
  deleteTicket 
} = require('../controllers/ticketController');
const router = express.Router();

router.get('/tickets', getTickets);
router.get('/tickets/event/:eventId', getTicketsByEventId);
router.get('/tickets/:id', getTicketById);
router.post('/events/:eventId/tickets', createTicket);
router.put('/tickets/:id', updateTicket);
router.delete('/tickets/:id', deleteTicket);

module.exports = router;