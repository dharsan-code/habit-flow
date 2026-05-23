const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');
const taskController = require('../controllers/taskController');
const {verifyToken} = require('../middleware/authMiddleware');

// login and auth
router.post('/login', registerController.login);
router.post('/register', registerController.register);

// task curd
router.get('/tasks', verifyToken, taskController.getTasks);
router.post('/tasks', verifyToken, taskController.createTask);
router.put('/tasks/:id', verifyToken, taskController.updateTask);
router.delete('/tasks/:id', verifyToken, taskController.deleteTask);

module.exports = router;
