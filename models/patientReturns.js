const mongoose = require('mongoose');
const PatientReturns = new mongoose.Schema({
    Medicine:String,
    Price:Number,
    ExpiryDate:Date,
    Qty:Number,
    Batch:String,
    AddedBy: String
},
{
    timestamps:true
});

const PatientReturn = mongoose.model('PatientReturns', PatientReturns);
module.exports = PatientReturn;