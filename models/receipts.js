const mongoose = require('mongoose');
const Receipt = new mongoose.Schema({
    Medicine:String,
    Price:Number,
    ExpiryDate:Date,
    Qty:Number,
    ReceiptDate:Date,
    PatientId:Number,
    Name:String,
    Age:String,
    Gender:String,
    Address:String,
    Mobile:String,
    Items:{
        type:Array
    }
},
{
    timestamps:true
});

const Receipts = mongoose.model('Receipt', Receipt);
module.exports = Receipts;