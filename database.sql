-- Create the database
CREATE DATABASE IF NOT EXISTS course_platform;
USE course_platform;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Courses table
CREATE TABLE IF NOT EXISTS Courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    instructor VARCHAR(255) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Enrollments table (for tracking user enrollments in courses)
CREATE TABLE IF NOT EXISTS Enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    courseId INT NOT NULL,
    progress INT DEFAULT 0,
    enrolledAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES Courses(id) ON DELETE CASCADE
);

-- Create an admin user (password: admin123)
INSERT INTO Users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NXFcw5DFO', 'admin');

-- Insert some sample courses
INSERT INTO Courses (title, description, price, instructor, duration, level) VALUES 
('Introduction to Web Development', 'Learn the basics of HTML, CSS, and JavaScript', 49.99, 'John Doe', '6 weeks', 'beginner'),
('Advanced JavaScript', 'Master modern JavaScript concepts and frameworks', 79.99, 'Jane Smith', '8 weeks', 'advanced'),
('Python Programming', 'Learn Python from scratch', 59.99, 'Mike Johnson', '10 weeks', 'beginner'),
('Data Science Fundamentals', 'Introduction to data science and analytics', 89.99, 'Sarah Wilson', '12 weeks', 'intermediate'); 