const express = require('express');
const postModel = require('../models/post');
const userModel = require('../models/user');


const postsRouter = express.Router()

postsRouter.get('/',async(req, res, next)=>{
    try
    {
        const result = await postModel.find({})
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing all failed"))
    }
})

postsRouter.get('/:postId',async (req,res, next)=>{
    try
    {
        const result = await postModel.findById(req.params.postId)
                    .populate("author").populate("usersComments").exec()
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing post failed"))
    }
})

postsRouter.post('/',async (req,res,next)=>{
    const postInstance = new postModel({
        author: req.body.author,
        title: req.body.title,
        body: req.body.body,
    })
    try
    {
        const result = await postInstance.save()
        console.log(res)
        res.json(result)
    }
    catch(e)
    {
        return next(new Error("Saving failed"))

    }
})

postsRouter.patch('/:postId', async (req,res)=>{
    try
    {
        const postInstance = {
            ...(req.body.author) ? {author: req.body.author} : {},
            ...(req.body.title) ? {firstname: req.body.title} : {},
            ...(req.body.body) ? {body: req.body.body} : {},
            ...(req.body.usersComments) ? {usersComments: req.body.usersComments} : {}
        }
        try
        {
            const result = await postModel.findOneAndUpdate({_id: req.params.postId}, 
                postInstance )
            console.log(result)
            res.send("post updated successfully")
        }
        catch(e)
        {
            next(new Error("post user failed"))
        }
    }
    catch(e)
    {
        console.log(e)   
    }
})

postsRouter.delete('/:postId', async (req,res)=>{
    try
    {
        const result = await postModel.deleteOne({_id: req.params.postId})
        console.log(result)
        res.send("Post deleted successfully")
    }
    catch(e)
    {
        next(new Error("Deleting post failed"))
    }
    try
    {
        const res = await userModel.findOneAndUpdate({}, 
                        { $pull: { posts: req.params.postId } })
        console.log("User updated successfully")
    }
    catch(e)
    {
        next(new Error("Updating user failed"))
    }
})



module.exports = postsRouter;