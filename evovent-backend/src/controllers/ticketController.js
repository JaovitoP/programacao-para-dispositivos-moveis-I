const Ticket = require('../models/ticketModel');


exports.getTicketsByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log('Event ID:', eventId); // Log para depuração
    // Validação básica
    if (!eventId) {
      return res.status(400).json({ message: 'ID do evento não fornecido' });
    }

    // Assumindo que seu modelo Ticket tem um método getByEventId
    const tickets = await Ticket.getByEventId(eventId);
    
    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ 
        message: 'Nenhum ticket encontrado para este evento',
        tickets: [] // Retorna array vazio para facilitar o tratamento no frontend
      });
    }

    // Formata os dados de retorno
    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      event_id: ticket.event_id,
      type: ticket.type,
      status: ticket.status,
      amount:  ticket.amount,
      price: ticket.price,
    }));

    res.json(formattedTickets);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar tickets do evento',
      details: err.message 
    });
  }
};

exports.getEventTickets = async (req, res) => {
  try {
    const { eventId } = req.params; // Obtém o ID do evento da URL
    console.log('Event ID:', eventId); // Log para depuração
    
    // Validação básica
    if (!eventId) {
      return res.status(400).json({ message: 'ID do evento não fornecido' });
    }

    // Obtém os tickets para o evento
    const tickets = await Ticket.getByEventId(eventId);

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ 
        message: 'Nenhum ticket encontrado para este evento',
        tickets: [] // Retorna array vazio para facilitar o tratamento no frontend
      });
    }

    // Formata os dados de retorno
    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      event_id: ticket.event_id,
      type: ticket.type,
      status: ticket.status,
      amount: ticket.amount,
      price: ticket.price,
    }));

    res.json(formattedTickets); // Envia os tickets como resposta
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar tickets do evento',
      details: err.message 
    });
  }
};


exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.getAll();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const ticket = await Ticket.getById(id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    const ticketData = {
      id: ticket.id,
      event_id: ticket.event_id,
      type: ticket.type,
      status: ticket.status,
      amount: ticket.amount,
      price: ticket.price
    };

    res.json(ticketData);
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao buscar ticket',
      details: err.message 
    });
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { event_id, type = 'Gratuito', status = 'active', amount, price = 0 } = req.body;

    // Validação mais robusta
    if (!event_id || isNaN(event_id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID do evento inválido ou faltando' 
      });
    }

    if (amount === undefined || isNaN(amount) || amount < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Quantidade de ingressos inválida' 
      });
    }

    const ticket = await Ticket.create({
      event_id: parseInt(event_id),
      type,
      status,
      amount: parseInt(amount),
      price: parseFloat(price)
    });

    return res.status(201).json({
      success: true,
      data: {
        id: ticket.id,
        event_id: ticket.event_id,
        type: ticket.type,
        amount: ticket.amount,
        price: ticket.price
      }
    });

  } catch (err) {
    console.error('Erro ao criar ticket:', err);
    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        success: false,
        message: 'Evento não encontrado' 
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno no servidor'
    });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { event_id, type, status, amount, price } = req.body;

    // Primeiro verifica se o ticket existe
    const existingTicket = await Ticket.getById(id);
    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    // Atualiza apenas os campos fornecidos
    const updatedData = {
      event_id: event_id !== undefined ? event_id : existingTicket.event_id,
      type: type || existingTicket.type,
      status: status || existingTicket.status,
      amount: amount !== undefined ? amount : existingTicket.amount,
      price: price !== undefined ? price : existingTicket.price
    };

    // Assumindo que seu modelo Ticket tem um método update
    // Você precisará implementar este método no modelo
    const result = await Ticket.update(id, updatedData);
    
    if (result === 0) { // Ou a condição que seu método update retornar
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    res.json({ message: 'Ticket atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao atualizar ticket',
      details: err.message 
    });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Primeiro verifica se o ticket existe
    const existingTicket = await Ticket.getById(id);
    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    // Assumindo que seu modelo Ticket tem um método delete
    // Você precisará implementar este método no modelo
    const result = await Ticket.delete(id);
    
    if (result === 0) { // Ou a condição que seu método delete retornar
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    res.json({ message: 'Ticket excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Erro ao excluir ticket',
      details: err.message 
    });
  }
};