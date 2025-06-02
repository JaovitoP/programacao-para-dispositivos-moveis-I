const Feedback = require('../models/feedbackModel');

// Buscar todos os feedbacks
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar feedbacks', details: err.message });
  }
};

// Buscar feedbacks por evento
exports.getFeedbacksByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: 'ID do evento não fornecido' });
    }

    const feedbacks = await Feedback.findAll({ where: { event_id: eventId } });

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: 'Nenhum feedback encontrado para este evento', feedbacks: [] });
    }

    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar feedbacks do evento', details: err.message });
  }
};

// Buscar feedback por ID
exports.getFeedbackById = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar feedback', details: err.message });
  }
};

// Criar novo feedback
exports.createFeedback = async (req, res) => {
  try {
    console.log('Criando feedback...');
    const { event_id, user_id, rating, comment } = req.body;
    console.log(event_id, user_id, rating, comment);

    if (!event_id || !user_id || !rating) {
      return res.status(400).json({ message: 'Dados incompletos para criação do feedback' });
    }

    const feedback = await Feedback.create({
      event_id,
      user_id,
      rating,
      comment,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({ id: feedback.id, message: 'Feedback criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar feedback', details: err.message });
  }
};

// Atualizar feedback
exports.updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    await feedback.update({
      rating: rating !== undefined ? rating : feedback.rating,
      comment: comment !== undefined ? comment : feedback.comment,
      updated_at: new Date(),
    });

    res.json({ message: 'Feedback atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar feedback', details: err.message });
  }
};

// Deletar feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByPk(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback não encontrado' });
    }

    await feedback.destroy();

    res.json({ message: 'Feedback excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir feedback', details: err.message });
  }
};
