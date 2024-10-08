const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    full_name:{
        type: String,
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default : false
    },
    role:{
        type:String
    },
    address:{
        type:String
    },
    mobile_number:{
        type:String
    },
    updater:Number,
},
{
    timestamps: true
});


let User = mongoose.model('User', userSchema);
module.exports = User;