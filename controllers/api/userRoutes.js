const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth')
const SequelizeStore = require('connect-session-sequelize')(session.Store);

router.post('/', (req, res)=>{
    User.create({
        username: req.body.username,
        // email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData =>{
        req.session.userId = dbUserData.id;
        req.session.username = dbUserData.username;
        console.log(
            {dbUserData}, "user-signUp"
        )

        req.session.loggedIn = true;
        res.json(dbUserData);
    })
    .catch((err)=> {
        console.log(err)
        res.status(500).json(err)
    })
    ;
})

router.post('/login', (req, res)=>{
    User.findOne({
        where:{
            username: req.body.username
        }
    }).then(dbUserData =>{
        console.log(dbUserData, "firstUSER")
        if(!dbUserData) {
            res.status(400).json({ message: 'No user associated with that data!'})
            return;
        }

        const correctPw = dbUserData.checkPassword(req.body.password);
        if (!correctPw) {
            res.status(400).json({message: 'Wrong password!'})
            return;
        }
        console.log(
            {dbUserData}, "user"
        )
        req.session.userId = dbUserData.id;
        req.session.username = dbUserData.username;

        req.session.loggedIn = true;
        // res.json(dbUserData);
        req.session.save(()=>{
            req.session.userId= dbUserData.id;
            req.session.username= dbUserData.username;
            req.session.loggedIn = true;
            console.log(
                req.session, "session"
            )

            res.json({user: dbUserData, message: 'Logging in , Welcome!'})
        })
    })
})

router.post('/logout', (req, res)=>{
    if (req.session.loggedIn) {
        req.session.destroy(()=>{
            res.status(404).end();
        })
    }
    res.status(404).end();
})

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