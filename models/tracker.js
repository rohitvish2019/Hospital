const mongoose = require('mongoose');
const Tracker = new mongoose.Schema({
    PatientId : {
        type:Number
    },
    ReceiptNo:{
        type:Number,
        default:1
    },
    AdmittedPatientId:{
        type:Number
    },
    MedicalBillNo:Number,
    RegistrationBillNo:Number
},
{
    timestamps:true
});

const Trackers = mongoose.model('Tracker', Tracker);
module.exports = Trackers;