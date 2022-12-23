const router= require('express').Router()
const sequelize = require('../config/connection');
const {Post, User, Comment}= require('../models')

router.get('/', (req, res)=>{
    Post.findAll({
        include:[
          {
            model: User,
            attributes: ['username']
          }
        ]
    }).then(dbPostData =>{
        const posts= dbPostData.map(post=> post.get({plain:true}));
        res.render('homepage',{
          loggedIn: req.session.loggedIn,
            posts
        });
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/login', (req, res)=>{
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res)=>{
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
    res.render('sign-up');
});

router.get('/post/:id', (req, res)=>{
    Post.findByPk(req.params.id, {
        include: [
        User, 

            {
              model: Comment,
              include: [User],
              },
        
            
          ],
        }).then((dbPostData) => {
            if (!dbPostData) {
              const post = dbPostData.get({ plain: true });
              res.render('single-post', {
                post
              })
            }else {
                res.status(404).end();
              }
              })
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
});

module.exports = router;