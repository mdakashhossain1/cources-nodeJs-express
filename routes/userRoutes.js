const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

// Get all users (Admin only)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update user profile
router.put('/me', protect, async (req, res) => {
    try {
        const { password, role, ...updateData } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true
        }).select('-password');
        
        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Get users management page (Admin only)
router.get('/admin/users', protect, restrictTo('admin'), async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'email', 'role', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });

        res.render('admin/users', {
            users,
            user: req.user,
            title: 'User Management'
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).render('error', {
            error: 'Failed to fetch users',
            user: req.user
        });
    }
});

// Delete user (Admin only)
router.delete('/users/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const userId = req.params.id;
        const userToDelete = await User.findByPk(userId);

        if (!userToDelete) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        if (userToDelete.role === 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Cannot delete admin users'
            });
        }

        await userToDelete.destroy();

        res.status(200).json({
            status: 'success',
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete user'
        });
    }
});

module.exports = router; 