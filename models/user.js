// const { string } = require("joi");
const mongoose = require("mongoose");
const passpoetLocal = require("passport-local-mongoose");

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

userSchema.plugin(passpoetLocal);
module.exports = mongoose.model('User',userSchema);

