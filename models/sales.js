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
    SaleDate:String,
    cancellationReason:String,
    ReceiptNo:String,
    isValid:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});

const Sales = mongoose.model('Sale', Sale);
module.exports = Sales;