const propertiesReader = require('properties-reader');
const Patients = require('../models/patients');
const Appointments = require('../models/appointments');
const Visits = require('../models/visits');
const Tracker = require('../models/tracker')
module.exports.addNewPatient = async function(req, res){
      try{
            let patient = await Patients.create(req.body);
            let pd = await Tracker.findOne({});
            let lastPatientId = pd.PatientId;
            if(lastPatientId == null || lastPatientId == ""){
                  await patient.updateOne({PatientId:1});
                  await Tracker.create({
                        PatientId:1
                  })
            }else{
                  await patient.updateOne({PatientId:lastPatientId+1});
                  await pd.updateOne({PatientId:lastPatientId+1});
            }

            try{  
                  console.log("Id : "+req.body.bookAppointment)
                  if(req.body.bookAppointment == 'true'){
                        console.log("Creating appointments")
                        await Appointments.create({
                              PatientId:patient._id,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate(),
                              isVisited:false
                        })
                  }
                  
            }catch(err){
                  console.log(err);
                  return res.status(500).json({
                        message:'Patient Created, Unable to add appointment'
                  })
            }
            
            return res.status(200).json({
                  message:'Patient created'
            })
      }catch(err){
            console.log(err);
            return res.status(500).json({
                  message:'Unable to add patient'
            })
      }
}
/*
module.exports.linkPatients = function(req, res){

}

module.exports.updatePatientData = function(req, res){
    
}
*/

module.exports.newVisit =async   function(req, res){
      let patient = await Patients.findById(req.params.id)
      let properties = propertiesReader('./properties/UIdata.properties');
      console.log(req.params.id);
      let SavedData = await Visits.findOne({
            PatientId:req.params.id,
            Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
      });
      
      let OE = properties.get('OnExaminations').split(',');
      return res.render('visitPad',{OE, patient, SavedData});
}

module.exports.patientRegistration = function(req, res){
      return res.render('patientRegistration');
}

module.exports.addExaminations = async function(req, res){
      try{
            let keys = Object.keys(req.body);
            let dataInArray = [];
            for(let i=0;i<keys.length;i++){
                  dataInArray.push(keys[i]+":"+req.body[keys[i]]);
            }
            let savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            if(savedData){
                  console.log(savedData)
                  await savedData.updateOne({OEs:dataInArray});
            }else{
                  let visit = await Visits.create({
                        PatientId:req.params.patientId,
                        OEs:dataInArray
                  });
                  await visit.updateOne({Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()});
            }
            await Appointments.findOneAndUpdate({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            },{
                  isVisited:true
            })
            return res.status(200).json({
                  message:'OEs Updated'
            })
      }catch(err){
            return res.status(500).json({
                  message:'Unable to update OEs'
            })
      }
      
}

module.exports.addTests = async function(req, res){
      try{
            let keys = Object.keys(req.body);
            let dataInArray = [];
            for(let i=0;i<keys.length;i++){
                  dataInArray.push(keys[i]+":"+req.body[keys[i]]);
            }
            let savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            if(savedData){
                  console.log(savedData)
                  console.log("Here we go")
                  await savedData.updateOne({Tests:dataInArray});
            }else{
                  let visit = await Visits.create({
                        PatientId:req.params.patientId,
                        Tests:dataInArray
                  });
                  await visit.updateOne({Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()});
            }
            await Appointments.findOneAndUpdate({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            },{
                  isVisited:true
            })
            return res.status(200).json({
                  message:'Tests Updated'
            })
      }catch(err){
            return res.status(500).json({
                  message:'Unable to update Tests'
            })
      }

}

module.exports.addComplaint = async function(req, res){
      try{
            let savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            if(savedData){
                  await savedData.updateOne({Complaint:req.body.Complaint});
            }else{
                  let visit = await Visits.create({
                        PatientId:req.params.patientId,
                        Complaint:req.body.Complaint,
                        Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                  });
            }
            await Appointments.findOneAndUpdate({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            },{
                  isVisited:true
            })
            return res.status(200).json({
                  message:'Complaint Updated'
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to update complaint'
            })
      }
}
module.exports.getPatientById = async function(req, res){
      try{
            let patient = await Patients.findOne({PatientId:req.params.PatientId});
            if(patient){
                  return res.status(200).json({
                        patient
                  })
            }else{
                  return res.status(404).json({
                        message:'No patient found'
                  })
            }
            
      }catch(err){
            return res.status(500).json({
                  message:'Error 500 : Unable to find patient'
            })
      }
      
}


module.exports.getSavedData = async function(req, res){
      try{
            let savedData = await Visits.findOne({
                  PatientId:req.query.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            return res.status(200).json({
                  savedData
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to fetch saved information'
            })
      }
}

module.exports.getPriscriptionForm =async function(req, res){
      let patient = await Patients.findById(req.params.patientId);
      return res.render('prescriptionForm',{patient});
}

module.exports.medicationsPage = async function(req, res){
      let patient = await Patients.findById(req.params.patientId);
      return res.render('medications',{patient})
}

module.exports.savePrescriptions = async function(req,res){
      try{
            let savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            await savedData.updateOne({Prescriptions:req.body.prescriptions});
            return res.status(200).json({
                  message:'Prescriptions added',
                  visitId : savedData._id
            })
      }catch(err){
            return res.status(500).json({
                  message:'Unable to add prescriptions'
            })
      }
}

module.exports.getPrescriptions = async function(req, res){
      try{
            let savedData = await Visits.findOne({
                  PatientId:req.query.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            if(!savedData){
                  return res.status(404).json({
                        message:'Visit not completed yet'
                  })
            }
            return res.status(200).json({
                  savedData : savedData.Prescriptions,
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to fetch saved information'
            })
      }
}