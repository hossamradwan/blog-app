const express = require('express');
const commentModel = require('../models/comment');
const postModel = require('../models/post');

const commentsRouter = express.Router()

commentsRouter.get('/', async(req, res, next)=>{
    try
    {
        const result = await commentModel.find({})
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing all failed"))
    }
})

commentsRouter.get('/:commentId', async (req,res, next)=>{
    try
    {
        const result = await commentModel.findById(req.params.commentId)
                    .populate("commenter").populate("post").exec()
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing comment failed"))
    }
})

commentsRouter.post('/', async (req, res, next)=>{
    const commentInstance = new commentModel({
        commenter: req.body.commenter,
        body: req.body.body,
        post: req.body.post,
    })
    try
    {
        const result = await commentInstance.save()
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        return next(new Error("Saving failed"))

    }
})

commentsRouter.patch('/:commentId', async (req,res)=>{
    try
    {
        const commentInstance = {
            ...(req.body.commenter) ? {commenter: req.body.commenter} : {},
            ...(req.body.body) ? {body: req.body.body} : {},
            ...(req.body.post) ? {post: req.body.post} : {},
        }
        try
        {
            const result = await commentModel.findOneAndUpdate({_id: req.params.commentId}, 
                commentInstance )
            console.log(result)
            res.send("Comment updated successfully")
        }
        catch(e)
        {
            next(new Error("Updating comment failed"))
        }
    }
    catch(e)
    {
        console.log(e)   
    }
})

commentsRouter.delete('/:commentId', async (req,res)=>{
    try
    {
        const result = await commentModel.deleteOne({_id: req.params.commentId})
        console.log(result)
        res.send("comment deleted successfully")
    }
    catch(e)
    {
        next(new Error("Deleting comment failed"))
    }
    try
    {
        const res = await postModel.findOneAndUpdate({}, 
                        { $pull: { usersComments: req.params.commentId } })
        console.log("Post updated successfully")
    }
    catch(e)
    {
        next(new Error("Updating post failed"))
    }
})



module.exports = commentsRouter;