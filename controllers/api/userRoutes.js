const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth')
const SequelizeStore = require('connect-session-sequelize')(session.Store);


router.get('/', (req, res)=>{
    User.findAll({
        attributes: {exclude: ['password']}
    })
    .then(dbUserData=> res.json(dbUserData))
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    })
});

router.get('/:id', (req, res)=>{
    User.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['title', 'body']
            },
            {
                model: Comment,
                attributes: ['body'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData =>{
        if (!dbUserData){
            res.status(404).json({message: 'No user with that ID'});
            return;
        } res.json(dbUserData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
    })
})
module.exports = router;