const mongoose = require('mongoose');
const Patients = new mongoose.Schema({
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
    Prescriptions:{
        type:Array,
        ref:'Prescriptions'
    }
},
{
    timestamps:true
});

const patients = mongoose.model('Patients', Patients);
module.exports = patients;