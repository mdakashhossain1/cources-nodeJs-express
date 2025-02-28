const { Course, User } = require('../models');

exports.getHomePage = async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.render('home', { 
            courses: courses || [],
            user: req.user || null 
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('error', { 
            error: error,
            user: req.user || null
        });
    }
};

exports.getAdminDashboard = async (req, res) => {
    try {
        const courses = await Course.findAll({
            order: [['createdAt', 'DESC']]
        });
        
        res.render('admin/dashboard', { 
            courses: courses || [],
            user: req.user 
        });
    } catch (error) {
        res.status(500).render('error', { 
            error: error,
            user: req.user 
        });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: Course
        });

        res.render('user/profile', { 
            user,
            enrolledCourses: user?.Courses || []
        });
    } catch (error) {
        res.status(500).render('error', { 
            error: error,
            user: req.user 
        });
    }
}; 