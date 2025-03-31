const Event = require('../models/eventModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.getAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.getById(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    // Formata os dados para o frontend
    const eventData = {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date, // ou combine date + time se necessário
      time: event.time, // apenas se seu frontend precisar separado
      location: event.location,
      status: event.status,
      color: event.color || '#6366f1', // valor padrão
      category: event.category,
      createdAt: event.created_at
    };

    res.json(eventData);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar evento',
      details: err.message 
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, description, date, location, color, category } = req.body;
    const eventId = await Event.create(name, description, date, location, color, category);
    res.status(201).json({ id: eventId, message: 'Evento criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  };

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