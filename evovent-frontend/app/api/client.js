import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.43.192:5000/api',
});
api.interceptors.request.use(config => {
  console.log('Enviando requisição para:', config.url);
  return config;
});
export default {
  getEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
};