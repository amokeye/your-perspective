// Imports
const router = require('express').Router();
const dashboardRoutes = require('./dashboard-routes.js');
const homeRoutes = require('./home-routes.js');



router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;