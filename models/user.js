const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('jsonwebtoken');

const userShcema = new mongoose.Schema({
    username: {type: String, unique: true, minLength: 6, required: true},
    firstname: {type: String, unique: true, minLength: 4},
    lastname: {type: String, unique: true, minLength: 4},
    dob: {type: Date, required: true},
    gender: {type: String, enum: ["m", "f"], required: true},
    password: {type: String, minLength: 6, required: true},
    posts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}] 
});

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

userShcema.methods.getUserAge = function (){
    return calculate_age(new Date(this.dob))
}

userShcema.statics.getGender = function (gender){
    return this.find({gender: gender})
}

userShcema.pre('save', async function(next){
    const doc = this;
    if(doc.isNew)
    {
        try
        {
            const pass = await bcrypt.hash(this.password, 10);
            doc.password = pass;
            next();
        }
        catch(e)
        {
            next(new Error("Encription failed"))
        }

    }
})

const userModel = mongoose.model("User",userShcema);

module.exports = userModel;