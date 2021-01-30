// Imports
const { Comment } = require('../../models');
const router = require('express').Router();
const withAuth = require('../../utils/auth');

// GET all comments
router.get('/', (req, res) => {
    Comment.findAll().then(allComments =>
        res.json(allComments)).catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

// POST (create) a comment
router.post('/', withAuth, (req, res) => {
    if (req.session) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id
        }).then(newComment =>
            res.json(newComment)).catch(error => {
                console.log(error);
                res.status(400).json(error);
            });
    }
});

// DELETE a single comment
router.delete('/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    }).then(comToDelete => {
            if (!comToDelete) {
                res.status(404).json({ message: 'Comment does not exist.' })
                return;
            }
            res.json(comToDelete);
        }).catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

module.exports = router;