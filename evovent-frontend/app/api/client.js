import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.43.192:5000/api',
});
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  return config;
});
export default {
  getEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // Feedbacks
  getAllFeedbacks: () => api.get('/feedbacks'),
  getFeedbackById: (id) => api.get(`/feedbacks/${id}`),
  getFeedbacksByEventId: (eventId) => api.get(`/feedbacks/event/${eventId}`),
  createFeedback: (data) => api.post('/feedbacks', data),
  updateFeedback: (id, data) => api.put(`/feedbacks/${id}`, data),
  deleteFeedback: (id) => api.delete(`/feedbacks/${id}`),

  // Tickets
  createTicket: (eventId, ticketsData) => api.post(`/events/${eventId}/tickets`, ticketsData),
  getTicketsByEventId: (eventId) => api.get(`/tickets/event/${eventId}`),

  // Users
  getUserById: async (userId) => {
    return axios.get(`/users/${userId}`);
  },

  // Reservations
  createReservation: (reservationData) => api.post('/reservations', reservationData),
  getReservationsByUser: (userId) => api.get(`/users/${userId}/reservations`), // Usando o endpoint correto
  getReservationById: (id) => api.get(`/reservations/${id}`),
};