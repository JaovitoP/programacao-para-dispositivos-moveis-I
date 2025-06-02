const Reservation = require('../models/reservationModel');

exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.getAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar reservas', 
      details: err.message 
    });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.getById(id);
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar reserva',
      details: err.message 
    });
  }
};

exports.createReservation = async (req, res) => {
  try {
    console.log('Creating reservation with data:', req.body);
    const { user_id, status, ticket_id, amount, event_id, code } = req.body;
    
    // Verifica se o código é único
    const isCodeUnique = await Reservation.isCodeUnique(code);
    if (!isCodeUnique) {
      return res.status(400).json({ error: 'Código de reserva já está em uso' });
    }

    const reservation = await Reservation.createReservation({
      user_id,
      status: status || 'active',
      ticket_id,
      amount,
      event_id,
      code
    });
    
    res.status(201).json({ 
      id: reservation.id, 
      message: 'Reserva criada com sucesso!' 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao criar reserva',
      details: err.message 
    });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, status, ticket_id, amount, event_id, code } = req.body;

    // Verifica se o código é único (excluindo a reserva atual)
    if (code) {
      const isCodeUnique = await Reservation.isCodeUnique(code, id);
      if (!isCodeUnique) {
        return res.status(400).json({ error: 'Código de reserva já está em uso' });
      }
    }

    const affectedRows = await Reservation.updateReservation(id, {
      user_id, 
      status, 
      ticket_id, 
      amount, 
      event_id, 
      code
    });
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json({ message: 'Reserva atualizada com sucesso!' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao atualizar reserva',
      details: err.message 
    });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await Reservation.deleteReservation(id);
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json({ message: 'Reserva excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao excluir reserva',
      details: err.message 
    });
  }
};

// Métodos adicionais
exports.getReservationsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) {
      return res.status(400).json({ message: 'ID do usuário não fornecido' });
    }

    const reservations = await Reservation.findAll({ where: { user_id: user_id } });

    if (!reservations || reservations.length === 0) {
      return res.status(404).json({ message: 'Nenhuma reserva encontrada para este evento', reservations: [] });
    }

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar reservations do evento', details: err.message });
  }
};


exports.getReservationsByEventId = async (req, res) => {
  try {
    const { event_id } = req.params;
    const reservations = await Reservation.findByEventId(event_id);
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar reservas do evento',
      details: err.message 
    });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const affectedRows = await Reservation.updateStatus(id, status);
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada' });
    }

    res.json({ message: 'Status da reserva atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao atualizar status da reserva',
      details: err.message 
    });
  }
};