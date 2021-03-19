const mongoose = require('mongoose');
const userModel = require('./user');

const postShcema = new mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, minLength: 6, required: true, ref: "User"},
    title: {type: String, unique: true, minLength: 6},
    body: {type: String, minLength: 5},
    usersComments: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}]  
});

postShcema.post('save', async function(){
    const doc = this;
    try
    {
        const result = await userModel.findOneAndUpdate({_id: this.author}, 
            { $push: { posts: this._id } })
        console.log("User updated successfully")
    }
    catch(e)
    {
        next(new Error("Updating user failed"))
    } 
})


const postModel = mongoose.model("Post",postShcema);

module.exports = postModel;