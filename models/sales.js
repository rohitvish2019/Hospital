const mongoose = require('mongoose');
const Sale = new mongoose.Schema({
    PatientId:{
        type:mongoose.Types.ObjectId,
        ref:'Patients'
    },
    PatientName:String,
    BillAmount:Number,
    BillType:String,
    BillLink:String,
    SaleDate:String
},
{
    timestamps:true
});

const Sales = mongoose.model('Sale', Sale);
module.exports = Sales;