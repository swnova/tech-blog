const router = require('express').Router();
const { User, Post, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.get('/', (req, res)=> {
    Post.findAll({
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        include:[
            {
                model: User,
                attributes:['username']
            },
            {
                model: Comment,
                attributes:[
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include:{
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    }).then(dbPostData=> res.json(dbPostData))
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
        })
})

router.get('/:id', (req, res) =>{
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_text',
            'title',
            'created_at',
        ],
        include:[
            {
                model: User,
                attributes:['username']
            },
            {
                model: Comment,
                attributes:[
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'
                ],
                include:{
                    model: User,
                    attributes: ['username']
                }
        
            }
        ]
    }).then(dbPostData=>{
        if (!dbPostData){
            res.status(404).json({message: 'No post with that ID, playa'})
        }
        res.json(dbPostData);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json(err);
        });
});

router.put('/:id', withAuth, (req,res)=>{
    Post.update(req.body,
        {
            where: {
                id:req.params.id
            }
        }).then(dbPostData=>{
            if(!dbPostData){
                res.status(404).json({message: 'No post with that ID'})
                return;
            } res.json(dbPostData)
        }) .catch(err =>{
            console.log(err);
            res.status(500).json(err);
            })
});

router.delete('/:id', withAuth, (req, res)=>{
    Post.destroy({
        where:{
            id: req.params.id
        }
    }).then(dbPostData=>{
    if(!dbPostData){
        res.status(404).json({message: 'no post with that id, sun'});
        return;
    }
    res.json(dbPostData);
    }).catch(err =>{
    console.log(err);
    res.status(500).json(err);
    })

});

module.exports = router;