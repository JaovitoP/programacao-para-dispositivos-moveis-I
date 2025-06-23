require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
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

const app = express();

app.use(bodyParser.json());

// 3. Servir arquivos estáticos (DEPOIS do debug)
app.use('/uploads', express.static(
  path.join(__dirname, '../uploads').replace(/\\/g, '/')
));
app.use('/api', eventRoutes);
app.use('/api', ticketRoutes);
app.use('/api', userRoutes);
app.use('/api', reservationRoutes);
app.use('/api', feedbackRoutes);
app.use('/api', authRoutes);

app.use(cors()); 

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(
  path.join(__dirname, 'uploads').replace(/\\/g, '/')
));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
