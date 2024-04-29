const Appointments = require('../models/appointments');
const Patients = require('../models/patients');
module.exports.addAppointment = async function(req, res){
    try{
        let today = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate();
        let patient = await Patients.findOne({PatientId:req.body.PatientId});
        let oldAppointment = await Appointments.findOne({PatientId:patient._id, Date:today});
        if(oldAppointment){
            return res.status(409).json({
                message:'Appointment already booked for today'
            })
        }
        let appointment = await Appointments.create({
            NumericPatientId:req.body.PatientId,
            PatientId:patient._id,
            Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate(),
            isVisited:false,
        });
        return res.status(200).json({
            message:'Appointment added'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to add appointment'
        })
    }
    
}

module.exports.showTodaysAppointments = async function(req, res){
    try{
        let dateSelected = req.body.dateSelected;
        if(dateSelected == null || dateSelected == ''){
            dateSelected = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate();
        }
        let appointments = await Appointments.find({Date:dateSelected}).populate('PatientId');
        console.log(appointments);
        return res.render('showAppointments',{appointments});
    }catch(err){
        console.log(err)
        return res.render('showAppointments',{error:'Unable to find appointments'});
    }
}