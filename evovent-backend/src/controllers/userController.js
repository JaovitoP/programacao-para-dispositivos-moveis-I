const User = require('../models/userModel');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getById(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at
    };

    res.json(userData);
  } catch (err) {
    res.status(500).json({
      error: 'Erro ao buscar usuário',
      details: err.message
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userId = await User.create(name, email, password);

    res.status(201).json({ id: userId, message: 'Usuário criado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const result = await User.update(id, name, email, password);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.delete(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({ message: 'Usuário excluído com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
