const Visits = require('../models/visits')
module.exports.getMedicalBill = async function(req, res){
    console.log(req.params.visitId);
    let visit = await Visits.findById(req.params.visitId).populate('PatientId');
    return res.render('medbill',{patient:visit.PatientId, prescriptions:visit.Prescriptions});
}