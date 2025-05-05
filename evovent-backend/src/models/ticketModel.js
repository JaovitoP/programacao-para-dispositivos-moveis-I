const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id',
    },
    defaultValue: 'Gratuito' ,
    onDelete: 'CASCADE',
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.,
  }
}, {
  tableName: 'tickets',
  timestamps: false,
});

Ticket.getAll = async () => {
  try {
    const tickets = await Ticket.findAll();
    return tickets;
  } catch (err) {
    throw err;
  }
};
Ticket.getById = async (id) => {
  try {
    const ticket = await Ticket.findByPk(id);
    return ticket;
  } catch (err) {
    throw err;
  }
};

Ticket.getByEventId = async (eventId) => {
  try {
    const tickets = await Ticket.findAll({
      where: { event_id: eventId },
    });
    return tickets;
  } catch (err) {
    throw err;
  }
};
module.exports = Ticket;
