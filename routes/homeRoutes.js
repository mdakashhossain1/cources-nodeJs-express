const { Course } = require('../models');

router.get('/', async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'image', 'price'],
    });

    // Convert to plain objects
    const courseList = courses.map(course => course.get({ plain: true }));

    res.render('home', {
      courses: courseList,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
}); 