const db = require('../config/db');

exports.createUser = async(username, email, password) => {
    const [result] = await db.query('INSERT INTO users (username, email, password) VALUES(?, ?, ?)', [username, email, password]);
    return result;
}

exports.login = async(email, password) => {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}