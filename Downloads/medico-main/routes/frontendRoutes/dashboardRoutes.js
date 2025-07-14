const express = require('express');
const router = express.Router();
const Department = require('../../models/departmentsModel');


// Login session authentication
function isAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  } else {
    res.redirect('/');
  }
}


// Route for /dashboard (defaults to 'appointments')
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard/pages/home', { page: 'appointments' });
});

// Route for department page where I will be fetching Departments and Doctors
router.get('/:page', isAuthenticated, async (req, res) => {
  const page = req.params.page;

  // Special handling for 'doctors' page
  if (page === 'doctors') {
        try {
            const departments = await Department.find();

            return res.render('dashboard/pages/home', {
                page,
                categories: departments ?? []            
            });
        } catch (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
    }

    // Default render for all other pages
    res.render('dashboard/pages/home', { page });
});


module.exports = router;
