const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Course } = require('../models');
const bcrypt = require('bcryptjs');

// Middleware to check if user is already logged in
const redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/courses');
    }
    next();
};

// Login page
router.get('/login', redirectIfAuthenticated, (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

// Register page
router.get('/register', redirectIfAuthenticated, (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('auth/login', {
                error: 'Invalid credentials',
                user: null
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Set JWT cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Fetch courses and redirect to courses page
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.render('courses/index', { 
            title: 'All Courses',
            user: req.session.user,
            courses: courses
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).render('auth/login', {
            error: 'Login failed',
            user: null
        });
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).render('auth/register', {
                error: 'Email already registered',
                user: null
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: 'user'
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Store in session
        req.session.token = token;
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        // Set JWT cookie
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Redirect to courses page
        return res.redirect('/courses');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).render('auth/register', {
            error: 'Registration failed',
            user: null
        });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Clear session
    req.session.destroy();
    
    // Clear JWT cookie
    res.clearCookie('jwt');
    
    res.redirect('/');
});

module.exports = router; 