const db = require('../config/db');

exports.createTask = (userId, title) => {
    return db.query('INSERT INTO tasks (userId, title) VALUES(?, ?)', [userId, title]);
}

exports.getTasks = async(userId) => {
    const [rows] = await db.query('SELECT * FROM tasks WHERE userId = ?', [userId]);
    return rows;
}

exports.deleteTask = (id, userId) => {
    return db.query('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);
}

exports.updateTask = (id, userId, completed) => {
    return db.query('UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?',[completed, id, userId]);
}