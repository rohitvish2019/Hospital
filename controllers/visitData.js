const Visits = require('../models/visits')
module.exports.getMedicalBill = async function(req, res){
    try{
        let visit = await Visits.findById(req.params.visitId).populate('PatientId');
        return res.render('medbill',{patient:visit.PatientId, prescriptions:visit.Prescriptions,role:req.user.role, visitDate:visit.createdAt});
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
    
}

module.exports.oldMedBill = async function(req, res){
    try{
        let d = req.query.date.split('-');
        let modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
        let visit = await Visits.findOne({PatientId:req.params.patientId, Date:modifiedDate}).populate('PatientId');
        return res.render('medbill_old', {patient:visit.PatientId, prescriptions:visit.Prescriptions,role:req.user.role,visitDate:visit.createdAt});
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}