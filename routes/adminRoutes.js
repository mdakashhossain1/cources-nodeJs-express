const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

// Admin dashboard
router.get('/dashboard', protect, restrictTo('admin'), async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.render('admin/dashboard', { 
            courses,
            user: req.user 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            error: error,
            user: req.user 
        });
    }
});

// Add new course page
router.get('/courses/new', protect, restrictTo('admin'), (req, res) => {
    res.render('admin/courses', {
        user: req.user,
        title: 'Add New Course'
    });
});

// Course management page
router.get('/courses', protect, restrictTo('admin'), async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.render('admin/courses', { 
            user: req.user,
            title: 'Course Management',
            courses: courses || []
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('admin/courses', {
            user: req.user,
            title: 'Course Management',
            courses: [],
            error: 'Failed to fetch courses'
        });
    }
});

// Create new course
router.post('/courses', protect, restrictTo('admin'), async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete course
router.delete('/courses/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const result = await Course.destroy({
            where: { id: req.params.id }
        });

        if (result === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Course deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete course'
        });
    }
});

module.exports = router; 