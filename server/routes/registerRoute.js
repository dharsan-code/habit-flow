const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');
const taskController = require('../controllers/taskController');
const {verifyToken} = require('../middleware/authMiddleware');
const settingsController = require('../controllers/settingsController');

// login and auth
router.post('/login', registerController.login);
router.post('/register', registerController.register);

// task curd
router.get('/tasks', verifyToken, taskController.getTasks);
router.post('/tasks', verifyToken, taskController.createTask);
router.put('/tasks/:id', verifyToken, taskController.updateTask);
router.delete('/tasks/:id', verifyToken, taskController.deleteTask);

//heatmap route
router.get('/heatmap', verifyToken, taskController.getHeatmap);

//get streak
router.get('/streak', verifyToken, taskController.getStreak);

router.get('/achivements', verifyToken, taskController.getAchievements);
router.get('/history/:date', verifyToken, taskController.getHistoryByDate);

// settings
router.get('/settings', verifyToken, settingsController.getSettings);

router.put('/settings/profile', verifyToken, settingsController.updateProfile );

router.put(
    '/settings/password',
    verifyToken,
    settingsController.changePassword
);

router.delete(
    '/settings/account',
    verifyToken,
    settingsController.deleteAccount
);

module.exports = router;
