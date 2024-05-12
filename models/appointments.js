const mongoose = require('mongoose');
const Appointment = new mongoose.Schema({
    PatientId : {
        type: mongoose.Types.ObjectId,
        ref:'Patients'
    },
    NumericPatientId:{
        type:Number
    },
    Date:{
        type:String,
    },
    isVisited :{
        type: Boolean,
    },
    isEmergency:{
        type:Boolean,
        default:false
    },
    Fees:Number
},
{
    timestamps:true
});

const Appointments = mongoose.model('Appointment', Appointment);
module.exports = Appointments;