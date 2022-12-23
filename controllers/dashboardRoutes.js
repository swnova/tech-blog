const router= require('express').Router();
const sequelize = require('../config/connection');
const {Post, User, Comment}= require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, (req,res)=>{
  console.log(req.session.userId)
    Post.findAll({
        where:{
            user_id: req.session.userId
        },
        attributes: ['title', 'body'],
        // include:[
        //     {
        //         model: Comment,
        //         attributes: ['comment_body'],
        //         include: {
        //             model: User,
        //             attributes: ['username'],
        //         }
        //     },
        //     {
        //         model: User,
        //         attributes: ['username']
        //     }
        // ]
    }).then(dbPostData=>{
        const posts= dbPostData.map(post=> post.get({plain: true}));
        res.render('dashboard', {posts, loggedIn: true});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
});


router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['title', 'body'],
      include: [
        {
          model: Comment,
          attributes: ['comment_body'],
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
    }).then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post with this id' });
          return;
        }
        const post = dbPostData.get({ plain: true });
        res.render('edit-post', { post, loggedIn: true });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

module.exports= router;