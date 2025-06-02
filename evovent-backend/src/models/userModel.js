const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Biografia ou descrição do produtor'
  },
  instagram_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do perfil no Instagram'
  },
  facebook_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do perfil no Facebook'
  },
  twitter_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do perfil no Twitter/X'
  },
  linkedin_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do perfil no LinkedIn'
  },
  tiktok_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do perfil no TikTok'
  },
  website_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    comment: 'URL do website pessoal ou da empresa'
  },
  cpf: {
    type: DataTypes.STRING(14), // Tamanho 14 para armazenar com máscara (000.000.000-00)
    allowNull: true, // Ou false se for obrigatório
    unique: true,
    validate: {
      is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/ // Regex que valida o formato com máscara
    },
    comment: 'CPF do usuário (formatado: 000.000.000-00)'
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Métodos existentes (mantidos da sua versão original)
User.getAll = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (err) {
    throw err;
  }
};

User.getById = async (id) => {
  console.log('Fetching user with ID:', id);
  try {
    const user = await User.findByPk(id);
    return user;
  } catch (err) {
    throw err;
  }
};

User.getEventsByUserId = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const events = await sequelize.models.Event.findAll({
      where: { userId: userId },
      order: [['created_at', 'DESC']]
    });

    return events;
  } catch (err) {
    console.error('Erro ao buscar eventos do usuário:', err);
    throw err;
  }
};

module.exports = User;