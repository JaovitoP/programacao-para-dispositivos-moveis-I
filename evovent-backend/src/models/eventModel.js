const poolPromise = require('../config/database');

const Event = {
  getAll: async () => {
    const pool = await poolPromise;
    const [rows] = await pool.query('SELECT * FROM events');
    return rows;
  },
  
  getById : async (id) => {
    const pool = await poolPromise;
    try {
      const [rows] = await pool.query(`
        SELECT 
          id, name, description, date, time, location, status, color, category, created_at
        FROM events 
        WHERE id = ?
      `, [id]);
  
      if (rows.length === 0) {
        return null;
      }
  
      return rows[0];
    } catch (err) {
      throw err;
    }
  },

  create: async (name, description, date, location, color, category) => {
    const pool = await poolPromise;
    const [result] = await pool.query(
      'INSERT INTO events (name, description, date, location, color, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, date, location, color, category]
    );
    return result.insertId;
  },

  async update(id, name, description, date, location, color, category) {
    const pool = await poolPromise;
    const [result] = await pool.query(
      'UPDATE events SET name = ?, description = ?, date = ?, location = ?, color = ?, category = ? WHERE id = ?',
      [name, description, date, location, color, category, id]
    );
    return result;
  },

  async delete(id) {
    const pool = await poolPromise;
    const [result] = await pool.query(
      'DELETE FROM events WHERE id = ?',
      [id]
    );
    return result;
  }
};

module.exports = Event;
