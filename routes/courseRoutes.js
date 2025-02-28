const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const { protect } = require('../middleware/auth');
const { restrictTo } = require('../middleware/rbac');

// Get all courses
router.get('/', protect, async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.render('courses/index', { 
            title: 'All Courses',
            user: req.session.user,
            courses: courses // Pass courses to the template
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).render('error', {
            error: 'Failed to fetch courses',
            user: req.session.user
        });
    }
});

// Get course details
router.get('/:id', protect, async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId);

        if (!course) {
            return res.status(404).render('error', {
                error: 'Course not found',
                user: req.session.user
            });
        }

        res.render('courses/details', {
            title: course.title,
            user: req.session.user,
            course: course
        });
    } catch (error) {
        console.error('Error fetching course details:', error);
        res.status(500).render('error', {
            error: 'Failed to fetch course details',
            user: req.session.user
        });
    }
});

// Create course (Admin only)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Update course (Admin only)
router.put('/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!course) {
            return res.status(404).json({
                status: 'error',
                message: 'Course not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: course
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// Delete course (Admin only)
router.delete('/delete/:id', protect, restrictTo('admin'), async (req, res) => {
    try {
        const courseId = req.params.id;
        console.log('Attempting to delete course:', courseId); // Debug log

        const result = await Course.destroy({
            where: { id: courseId }
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