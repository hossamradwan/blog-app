const express = require('express');



const PORT = process.env.PORT || 3000;
const app = express();

require('./boot/dbconnection')


const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const loginRouter = require('./routes/login')

app.use((req,res,next)=>{
    console.log(new Date(), req.url, req.method)
    next()
})

app.use((req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    console.log("first")
    if(typeof bearerHeader !== 'undefined') 
    {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, 'secretkeyHossam', (err, authData) => {
            if(err) 
            {
                res.sendStatus(403);
            } 
            else 
            {
                console.log("third") 
                next();
            }
        })
    } 
});

app.use(express.json())

app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/comments", commentsRouter)
app.use("/login",loginRouter)



app.use((err,req,res,next)=>{
    // console.log("error happened")
    console.log(err)

    res.status(401).send(err)
    next()
})



app.listen(PORT,(err)=>{
    if(err) console.log("Error")
    else console.log(`Server started on port ${PORT}`)
})
