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
    BroughtBy:{
        type:String
    },
    AdmissionDate:{
        type:Date
    },
    OperationDate:{
        type:Date
    },
    DischargeDate:{
        type:Date
    },
    OEs:{
        type:Object
    },
    AllegedHistory:String,
    PrimaryTreatment:String,
    XrayFindings:String,
    AdmissionNotes:String,
    Complications:String,
    TreatmentOnAdmission:String,
    TreatmentOnDischarge:{
        type:Array
    },
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