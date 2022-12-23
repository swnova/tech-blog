const router = require('express').Router();
const { Comment } = require('../../models/Comment');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, (req, res) =>{
    if (req.session){
        Comment.create({
            comment_body: req.body.comment_body,
            
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err =>{
        console.log(err);
        res.status(500).json(err);
        })
    }
});


module.exports = router;