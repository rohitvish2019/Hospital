const mongoose = require('mongoose');
const AdmittedPatients = new mongoose.Schema({
    PatientId : {
        type: Number,
    },
    Name:{
        type:String
    },
    Mobile :{
        type: String
    },
    Gender:{
        type:String,
    },
    Age: {
        type: Number,
    },
    Address: {
        type:String
    },
    Fees:{
        type:Number
    },
    AdmissionDate:{
        type:Date
    },
    DischargeDate:{
        type:Date
    },
    OperationDescription:String,
    OperationDate:String,
    DaysAdmitted:Number,
    Remarks:String,
    isDischarged:{
        type:Boolean,
        default:false
    },
    Complaint:{
        type:String
    },
    DoctorName:{
        type:String
    },
    isValid:Boolean
},
{
    timestamps:true
});

const admittedPatients = mongoose.model('AdmittedPatients', AdmittedPatients);
module.exports = admittedPatients;