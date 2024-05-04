const mongoose = require('mongoose');
const MedicalBill = new mongoose.Schema({
    PatientId : {
        type:Number
    },
    Prescriptions:{
        type:Array
    },
    Name:String,
    Gender:String,
    Age:String
},
{
    timestamps:true
});

const MedicalBills = mongoose.model('MedicalBill', MedicalBill);
module.exports = MedicalBills;