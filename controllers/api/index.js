// Imports
const router = require('express').Router();
const postRoutes = require('./post-routes');
const userRoutes = require('./user-routes.js');
const commentRoutes = require('./comment-routes');

// Routes to webpage
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);

module.exports = router;