const express = require('express');
const userModel = require('../models/user');

const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
usersRouter.get('/', /*verifyToken,*/ async(req, res, next)=>{
    try
    {
        const result = await userModel.find({})
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing all failed"))
    }
})

usersRouter.get('/gender/:count', async (req, res, next)=>{
    const  gender  = req.params.count;
    try
    {
        const usersGender = await userModel.getGender(gender);
        res.send("Gender count = "+usersGender.length);
    }
    catch(e)
    {
        next(new Error("Getting gender count failed"))
    }
})

usersRouter.get('/:userId', async (req,res, next)=>{
    try
    {
        const result = await userModel.findById(req.params.userId).populate("posts").exec()
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        next(new Error("Listing user failed"))
    }
    
})

usersRouter.post('/', async (req,res,next)=>{
   
    const userInstance = new userModel({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        dob: req.body.dob,
        gender: req.body.gender,
        password: req.body.password,
    })
    try
    {
        const result = await userInstance.save()
        console.log(result)
        res.json(result)
    }
    catch(e)
    {
        return next(new Error("Saving failed"))

    }
    console.log("user age: ",userInstance.getUserAge())
  
})

usersRouter.patch('/:userId', async (req,res, next)=>{
    try
    {
        const userInstance = {
            ...(req.body.username) ? {username: req.body.username} : {},
            ...(req.body.firstname) ? {firstname: req.body.firstname} : {},
            ...(req.body.lastname) ? {lastname: req.body.lastname} : {},
            ...(req.body.dob) ? {dob: req.body.dob} : {},
            ...(req.body.gender) ? {gender: req.body.gender} : {},
            ...(req.body.password) ? {password: req.body.password} : {},
            ...(req.body.posts) ? {posts: req.body.posts} : {}
        }
        try
        {
            const result = await userModel.findOneAndUpdate({_id: req.params.userId}, 
                userInstance )
            console.log(result)
            res.send("User updated successfully")
        }
        catch(e)
        {
            next(new Error("Updating user failed"))
        }
    }
    catch(e)
    {
        console.log(e)   
    }
})

usersRouter.delete('/:userId',async (req,res)=>{
        try
        {
            const result = await userModel.deleteOne({_id: req.params.userId})
            console.log(result)
            res.send("User deleted successfully")
        }
        catch(e)
        {
            next(new Error("Deleting user failed"))
        }
    
})



module.exports = usersRouter;