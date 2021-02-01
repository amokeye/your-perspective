// Imports
const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET all posts
router.get('/', (req, res) => {
    Post.findAll({
        order: [['created_at', 'DESC']],
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
    }).then(allPosts => {
        res.json(allPosts);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// GET single post by `id`
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
    }).then(singlePost => {
        if (!singlePost) {
            res.status(404).json({ message: 'Invalid post id; no matching post found.' });
            return;
        }

        const post = singlePost.get({ plain: true });

        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// POST (create) new post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
    }).then(newPost => {
        res.json(newPost);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// PUT (update) post by `id`
router.put('/:id', withAuth, (req, res) => {
    Post.update(req.body,
        {
            where: {
                id: req.params.id
            }
        }).then(postToUpdate => {
            if (!postToUpdate) {
                res.status(404).json({ message: 'Invalid id; no matching post found.' });
                return;
            } else {
                req.session.save(() => {
                    req.session.title = req.body.title,
                        req.session.content = req.body.content,
                        req.session.updatePost = true;

                    res.json(postToUpdate);
                }).catch(error => {
                    console.log(error);
                    res.status(500).json(error);
                });
            }
        })
});

// DELETE post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    }).then(postToDelete => {
        if (!postToDelete) {
            res.status(404).json({ message: 'Invalid id; no matching post found.' });
            return;
        }
        res.json(postToDelete);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

module.exports = router;