const router = require('express').Router();
const { User, Post, Comment} = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, (req, res)=> {
    Post.create({
        title: req.body.title,
        body: req.body.body
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
            
            'title',
            'body',
        ],
        include:[
            {
                model: User,
                attributes:['username']
            },
            {
                model: Comment,
                attributes:[
                    
                    'comment_body'
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