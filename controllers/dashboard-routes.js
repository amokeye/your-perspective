// Imports
const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Authenticate current user and GET all posts
router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPosts => {
        const posts = dbPosts.map(post => post.get({ plain: true }));
        res.render('dashboard', { layout: "secondary", posts, loggedIn: true });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// GET new posts
router.get('/new', withAuth, (req, res) => {
    res.render('new-post', { layout: "secondary" });
})

// GET single post by `id`
router.get('/post/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(singlePost => {
        if (singlePost) {
            const post = singlePost.get({ plain: true });

            res.render('single-post', { layout: "secondary", post, loggedIn: true });
        } else {
            res.status(404).json({ message: 'Invalid post id; no matching post found.' });
            return;
        }
    }).catch(error => {
        res.status(500).json(error);
    });
});

// GET post by `id`
router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'content',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(editPost => {
        if (!editPost) {
            res.status(404).json({ message: 'Invalid post id; no matching post found.' });
            return;
        }

        const post = editPost.get({ plain: true });
        res.render('edit-post', { layout: "secondary", post, loggedIn: true });
    }).catch(error => {
        res.status(500).json(error);
    });
});

// DELETE post by `id`
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(postToDelete => {
        if (!postToDelete) {
            res.status(404).json({ message: 'Invalid post id; no matching post found.' });
            return;
        }
        res.json(postToDelete);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// Allow user to log out and end session
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});


module.exports = router;