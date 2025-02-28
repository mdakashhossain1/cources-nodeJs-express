const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Course = require('./Course');

const Enrollment = sequelize.define('Enrollment', {
    progress: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

// Define relationships
User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

Enrollment.belongsTo(User, {
    foreignKey: 'UserId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Enrollment; 