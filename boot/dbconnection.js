const mongoose = require('mongoose');
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/blogDb"
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err)=>{
    if(err) console.log(err)
    else console.log("Connected to database")
})