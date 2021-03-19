const mongoose = require('mongoose');
const postModel = require('./post');

const commentShcema = new mongoose.Schema({
    commenter: {type: String, minLength: 6, required: true, ref: "User"},
    body: {type: String, minLength: 10, required: true},
    post: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post"}  
});

commentShcema.post('save', async function(){
    const doc = this;
    try
    {
        const result = await postModel.findOneAndUpdate({_id: this.post}, 
            { $push: { usersComments: this._id } })
        console.log("post updated successfully")
    }
    catch(e)
    {
        next(new Error("Updating post failed"))
    } 
})

const commentModel = mongoose.model("Comment",commentShcema);

module.exports = commentModel;