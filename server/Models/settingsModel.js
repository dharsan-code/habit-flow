const db = require('../config/db');

exports.getUserSettings = async (userId) => {
    const [rows] = await db.query(
        `SELECT id, username, email
         FROM users
         WHERE id = ?`,
        [userId]
    );

    return rows[0];
};

exports.updateProfile = async (userId, username, email) => {
    await db.query(
        `UPDATE users
         SET username = ?, email = ?
         WHERE id = ?`,
        [username, email, userId]
    );
};

exports.getUserById = async (userId) => {
    const [rows] = await db.query(
        `SELECT id, username, email, password
         FROM users
         WHERE id = ?`,
        [userId]
    );

    return rows[0];
};

exports.updatePassword = async (userId, hashedPassword) => {
    await db.query(
        `UPDATE users
         SET password = ?
         WHERE id = ?`,
        [hashedPassword, userId]
    );
};

exports.deleteAccount = async (userId) => {
    await db.query(
        `DELETE FROM users
         WHERE id = ?`,
        [userId]
    );
};