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
    Prescritions :{
        type:Array,
    },
    Tests:{
        type:Array,
    },
    OEs:{
        type:Array,
    },
    Date:{
        type:String
    }
},
{
    timestamps:true
});

const Visits = mongoose.model('Visit', Visit);
module.exports = Visits;