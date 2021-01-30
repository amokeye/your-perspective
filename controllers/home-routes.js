const router = require('express').Router();
const { Post, User, Comment } = require('../models');

// GET all posts with associated user info
router.get('/', (req, res) => {
    Post.findAll({
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
    }).then(allDbPosts => {
        const posts = allDbPosts.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
});

// Routes user to login if session not in place (otherwise, directs user back to dashboard)
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
});

// Routes user to home page if signed up/logged in (redirected to signup, otherwise)
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

// GET single post by `id` on home page
router.get('/post/:id', (req, res) => {
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
    }).then(search4Single => {
        if (!search4Single) {
            res.status(404).json({ message: 'Invalid post id; no matching post found.' });
            return;
        }

        // Serialize data
        const post = search4Single.get({ plain: true });

        // Render single post
        res.render('single-post', {
            layout: 'main', post, loggedIn: true
        }).catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
    });
});

module.exports = router;