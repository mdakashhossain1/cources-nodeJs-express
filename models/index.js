const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');

// Define relationships
User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

module.exports = {
    sequelize,
    User,
    Course,
    Enrollment
}; 