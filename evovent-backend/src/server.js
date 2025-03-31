const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/events');
require('dotenv').config();
const path = require('path');
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api', eventRoutes);

app.use(cors()); 

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
