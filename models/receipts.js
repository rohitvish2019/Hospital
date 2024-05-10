const mongoose = require('mongoose');
const Receipt = new mongoose.Schema({
    Medicine:String,
    Price:Number,
    ExpiryDate:Date,
    Qty:Number,
    ReceiptDate:Date,
},
{
    timestamps:true
});

const Receipts = mongoose.model('Receipt', Receipt);
module.exports = Receipts;