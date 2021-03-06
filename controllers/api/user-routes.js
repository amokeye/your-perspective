// Imports
const router = require('express').Router();
const { User, Post, Comment } = require('../../models');

// POST (create) new user
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(newUser => {
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.username = newUser.username;
            req.session.loggedIn = true;
            res.json(newUser);
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// GET all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    }).then(dbUserData => {
        res.json(dbUserData);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// GET user by `id`
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {
                model: Post,
                attributes: ['title']
            }
        ]
    }).then(singleUser => {
        if (!singleUser) {
            res.status(404).json({ message: 'Invalid id; no user found with matching id.' });
            return;
        }
        res.json(singleUser);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// DELETE user by `id`
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    }).then(userToDelete => {
        if (!userToDelete) {
            res.status(404).json({ message: 'Invalid id; no matching user found.' });
            return;
        }
        res.json(userToDelete);
    }).catch(error => {
        console.log(error);
        res.status(500).json(error);
    });
});

// Validate user credentials/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(userInfo => {
        if (!userInfo) {
            res.status(400).json({ message: 'No account found with username entered.' });
            return;
        }
        const validPassword = userInfo.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password.' });
            return;
        }
        req.session.save(() => {
            req.session.user_id = userInfo.id;
            req.session.username = userInfo.username;
            req.session.loggedIn = true;
            res.json({ user: userInfo, message: 'Login successful!' });
        })
    });
});

// Logout route
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

//
router.post('/post', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET post by `id`
router.get('/post/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;