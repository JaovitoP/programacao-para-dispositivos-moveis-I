const multer = require('multer');
const path = require('path');

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
const Event = require('../models/eventModel');
const User = require('../models/userModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    console.log(events);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar eventos', details: err.message });
  }
}

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.getById(id);
    const user = await User.getById(event.producer_id);
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }


    const eventData = {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time, 
      location: event.location,
      status: event.status,
      color: event.color || '#6366f1',
      category: event.category,
      createdAt: event.created_at,
      image: event.image,
      producer: {
        id: user.id,
        name: user.name,
        email: user.email,
        instagram_url: user.instagram_url,
        about: user.about,
        facebook_url: user.facebook_url,
        twitter_url: user.twitter_url,
        linkedin_url: user.linkedin_url,
      }
    };

    res.json(eventData);
  } catch (err) {
    console.error('Erro ao buscar evento:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar evento',
      details: err.message 
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, time, location, color, category, producer_id } = req.body;
    
    // Verifica se o arquivo foi enviado
    const imagePath = req.file ? req.file.path : null;

    console.log('Dados recebidos:', {
      name, description, date, time, location, 
      color, category, producer_id, image: imagePath
    });

    const event = await Event.create({
      name,
      description,
      date,
      time: time || '00:00:00', // Valor padrão se não for enviado
      location,
      color,
      category,
      image: req.file ? `/uploads/events/${req.file.filename}` : null,
      producer_id,
      status: 'active'
    });

    res.status(201).json({ 
      id: event.id, 
      message: 'Evento criado com sucesso!',
      imageUrl: imagePath ? `${req.protocol}://${req.get('host')}/${imagePath}` : null
    });
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, location, description, color, category } = req.body;

    // Assumindo que seu Event model tem um método update
    const result = await Event.update(id, name, description, date, location, color, category);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Event.delete(id);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    res.json({ message: 'Evento excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const events = await Event.findByProducerId(userId);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'Nenhum evento encontrado para este usuário' });
    }

    console.log(  'Eventos encontrados:', events);

    res.json(events);
  } catch (err) {
    console.error('Erro ao buscar eventos por usuário:', err);
    res.status(500).json({ 
      error: 'Erro ao buscar eventos por usuário', 
      details: err.message 
    });
  }
};
