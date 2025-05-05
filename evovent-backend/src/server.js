const express = require('express');
const path = require('path');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events');
const ticketRoutes = require('./routes/tickets');
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservations');
const feedbackRoutes = require('./routes/feedbacks');
const authRoutes = require('./routes/auth');

require('dotenv').config();
const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());

app.use('/api', eventRoutes);
app.use('/api', ticketRoutes);
app.use('/api', userRoutes);
app.use('/api', reservationRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', authRoutes);

app.use(cors()); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
