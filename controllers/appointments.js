const Appointments = require('../models/appointments');
const Patients = require('../models/patients');
const Sales = require('../models/sales')
module.exports.addAppointment = async function(req, res){
    try{
        let patient, oldAppointment, appointment
        let today = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate();
        try{
            patient = await Patients.findOne({PatientId:req.body.PatientId});
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'DB Error : Unable to find patient'
            })
        }
        try{
            oldAppointment = await Appointments.findOne({PatientId:patient._id, Date:today});
        }catch(err){
            console.log('DB Error : Unable to find old appointment')
        }
        
        if(oldAppointment){
            return res.status(409).json({
                message:'Appointment already booked for today'
            })
        }
        try{
            appointment = await Appointments.create({
                NumericPatientId:req.body.PatientId,
                PatientId:patient._id,
                Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate(),
                isVisited:false,
                Fees:req.body.Fees
            });
            await Sales.create({
                BillAmount:req.body.Fees,
                BillLink:'/appointments/receipt/'+appointment._id,
                BillType:'Registration Fees',
                PatientId:patient._id,
                SaleDate:new Date().getFullYear() +'-'+ String((Number(new Date().getMonth()) + 1)).padStart(2,'0') +'-'+ String(new Date().getDate()).padStart(2,'0'),
          })
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Unable to create appointment'
            })
        }
        let thisAppointment = Appointments.findById(appointment._id).populate('PatientId')
        return res.status(200).json({
            patientId: patient._id,
            appointment,
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
        let appointments = await Appointments.find({Date:dateSelected}).populate('PatientId').sort({createdAt: 1});
        return res.render('showAppointments',{appointments, role:req.user.role});
    }catch(err){
        console.log(err)
        return res.render('showAppointments',{error:'Unable to find appointments',role:req.user.role});
    }
}

module.exports.showOld = function(req, res){
    return res.render('oldAppointments.ejs',{role:req.user.role})
}

module.exports.getOldAppointments = async function(req, res){
    try{
        let d = req.query.selectedDate.split('-');
        let modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
        let appointments = await Appointments.find({Date:modifiedDate}).populate('PatientId');
        return res.status(200).json({
            appointments
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to get old appointments'
        })
    }
}

module.exports.getRegistrationReceipt = async function(req, res){
    try{
          let appointment = await Appointments.findById(req.params.id).populate('PatientId');
          return res.render('registrationReceipt',{appointment,role:req.user.role})
    }catch(err){
          return res.redirect('back')
    }
    
}