const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
  },
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tickets',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'events',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'reservations',
  timestamps: false,
});

Reservation.getAll = async () => {
  try {
    const reservations = await Reservation.findAll({
      include: [{
        model: require('./userModel'),
        as: 'user',
        attributes: ['id', 'name', 'email']
      }]
    });
    return reservations;
  } catch (err) {
    throw err;
  }
};

Reservation.getById = async (id) => {
  try {
    const reservation = await Reservation.findByPk(id);
    return reservation;
  } catch (err) {
    throw err;
  }
};

Reservation.createReservation = async (reservationData) => {
  try {
    const reservation = await Reservation.create(reservationData);
    return reservation;
  } catch (err) {
    throw err;
  }
};

Reservation.updateReservation = async (id, updateData) => {
  try {
    const [affectedRows] = await Reservation.update(updateData, {
      where: { id }
    });
    return affectedRows;
  } catch (err) {
    throw err;
  }
};

Reservation.deleteReservation = async (id) => {
  try {
    const affectedRows = await Reservation.destroy({
      where: { id }
    });
    return affectedRows;
  } catch (err) {
    throw err;
  }
};

// Métodos adicionais
Reservation.findByUserId = async (userId) => {
  try {
    const reservations = await Reservation.findAll({
      where: { user_id: userId }
    });
    return reservations;
  } catch (err) {
    throw err;
  }
};

Reservation.findByEventId = async (eventId) => {
  try {
    const reservations = await Reservation.findAll({
      where: { event_id: eventId },
      include: [{
        model: require('./userModel'),
        as: 'user',
        attributes: ['id', 'name', 'email', 'cpf']
      }]
    });
    return reservations;
  } catch (err) {
    throw err;
  }
};


Reservation.updateStatus = async (id, status) => {
  try {
    const [affectedRows] = await Reservation.update(
      { status },
      { where: { id } }
    );
    return affectedRows;
  } catch (err) {
    throw err;
  }
};

Reservation.isCodeUnique = async (code, excludeId = null) => {
  try {
    const where = { code };
    if (excludeId) {
      where.id = { [DataTypes.Op.ne]: excludeId };
    }
    const count = await Reservation.count({ where });
    return count === 0;
  } catch (err) {
    throw err;
  }
};

module.exports = Reservation;