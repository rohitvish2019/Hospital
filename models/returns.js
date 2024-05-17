const mongoose = require('mongoose');
const Return = new mongoose.Schema({
    Medicine:String,
    Qty:Number,
    ExpiryDate:Date,
    Batch:String,
    Price:Number,
},
{
    timestamps:true
});

const Returns = mongoose.model('Return', Return);
module.exports = Returns;