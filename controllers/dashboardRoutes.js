const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// GET '/dashboard' -renders the dashboard with existing blog posts
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        const currentUser = req.session.user_id;
        const postData = await Post.findAll({
            where: { user_id: currentUser },
            attributes: [
                'id',
                'title',
                'post_content',
                'created_at'
            ],
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('dashboard', {
            posts,
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// GET '/dashboard/new' - renders the page to create a new blog post

// GET '/dashboard/edit/:id' - Renders the page to edit an existing blog post

module.exports = router;