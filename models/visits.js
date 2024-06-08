const mongoose = require('mongoose');
const Visit = new mongoose.Schema({
    PatientId : {
        type: mongoose.Types.ObjectId,
        ref:'Patients'
    },
    appointmentId:{
        type:mongoose.Types.ObjectId,
        ref:'appointments'
    },
    NumericPatientId:{
        type:Number
    },
    Complaint:{
        type:String
    },
    Prescriptions :{
        type:Array,
    },
    WrittenPrescriptions:{
        type:Array
    },
    Tests:{
        type:Array,
    },
    OEs:{
        type:Array,
    },
    Date:{
        type:String
    },
    medDiscount:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});

const Visits = mongoose.model('Visit', Visit);
module.exports = Visits;