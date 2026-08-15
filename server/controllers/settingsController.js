const settingsModel = require('../Models/settingsModel');
const bcrypt = require('bcrypt');


exports.getSettings = async (req, res) => {
    try {
        const user = await settingsModel.getUserSettings(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error fetching settings'
        });
    }
};

exports.updateProfile = async (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({
            message: 'Username and email are required'
        });
    }
    try {
        await settingsModel.updateProfile(
            req.user.id,
            username,
            email
        );
        res.json({
            message: 'Profile updated successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error updating profile'
        });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            message: 'Current password and new password are required'
        });
    }
    try {
        const user = await settingsModel.getUserById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );
        if (!isMatch) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await settingsModel.updatePassword(
            req.user.id,
            hashedPassword
        );
        res.json({
            message: 'Password changed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error changing password'
        });
    }
};


exports.deleteAccount = async (req, res) => {
    try {
        await settingsModel.deleteAccount(req.user.id);
        res.json({
            message: 'Account deleted successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error deleting account'
        });
    }
};
