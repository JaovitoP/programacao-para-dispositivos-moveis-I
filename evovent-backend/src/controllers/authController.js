const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database'); // seu pool de conexão
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

exports.auth = async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await db;

    // Busca o usuário pelo email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(400).json({ msg: 'Usuário não encontrado' });
    }

    const user = users[0];

    // Compara a senha com o hash do banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
};
