const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database'); // seu pool de conexão
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

// Função de registro
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Verifica se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Cria usuário
    const user = new User({ name, email, password: hashedPassword, created_at: new Date(), updated_at: new Date() });
    await user.save();
    console.log('User created:', user);
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

  try {
    const { email, password } = req.body;
    // Encontra usuário
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user = users[0];

    // Compara a senha com o hash do banco
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha inválida' });
    }
    
    // Cria token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
