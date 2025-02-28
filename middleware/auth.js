const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.protect = async (req, res, next) => {
    try {
        // Check if user is already authenticated in session
        if (!req.session.user || !req.session.token) {
            return res.redirect('/auth/login');
        }

        // Verify token
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);

        // Check if user exists and token is valid
        const currentUser = await User.findByPk(decoded.id);
        if (!currentUser) {
            // Clear invalid session
            req.session.destroy();
            return res.redirect('/auth/login');
        }

        // Check if user changed password after token was issued
        if (currentUser.passwordChangedAt && 
            decoded.iat < currentUser.passwordChangedAt.getTime() / 1000) {
            req.session.destroy();
            return res.redirect('/auth/login?message=Please log in again');
        }

        // Grant access to protected route
        req.user = currentUser;
        // Make user available to templates
        res.locals.user = req.session.user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        req.session.destroy();
        res.redirect('/auth/login');
    }
};

// Middleware to redirect authenticated users
exports.redirectIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/courses');
    }
    next();
};

// Middleware to check if user is already logged in
exports.checkAuth = (req, res, next) => {
    if (req.cookies.jwt || req.session.token) {
        return res.redirect('/courses'); // Redirect to courses if already logged in
    }
    next();
}; 