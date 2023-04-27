const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET '/' - render home page with existing blog posts
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            attributes: [
                'id',
                'title',
                'post_content',
                'user_id'
            ],
            include: [{
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
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// router.get("/", async (req, res) => {
//     try {
//         const postData = await Post.findAll({
//             include: [{ model: Comment, include: [User] }, User],
//         });
//         const posts = postData.map((post) => post.get({ plain: true }));
//         res.render("homepage", { posts });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

// GET '/post/:id' - render single post page
router.get('/post/:id', async (req, res) => {
    try {
        const postData = Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            include: [{
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
        })

        if (!postData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }

        const post = (await postData).get({ plain: true })

        res.render('blogPost', {
            post,
            loggedIn: req.session.loggedIn
        })

    } catch (err) {
        res.status(500).json(err);
    }
})

// GET '/login' - renders the login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});


// // GET '/signup' - renders the signup page
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
});

module.exports = router;