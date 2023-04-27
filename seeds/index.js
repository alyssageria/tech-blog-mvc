const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userSeeds.json');
const postData = require('./postSeeds.json');
const commentData = require('./commentSeeds.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    await User.bulkCreate(userData);
    await Post.bulkCreate(postData);
    await Comment.bulkCreate(commentData);

    console.log('Database seeded successfully!');
    process.exit(0);
};

seedDatabase();