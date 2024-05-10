const propertiesReader = require('properties-reader');
const Patients = require('../models/patients');
const Appointments = require('../models/appointments');
const Visits = require('../models/visits');
const Tracker = require('../models/tracker');
const Inventories = require('../models/inventory');
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
                  
                  if(req.body.bookAppointment == 'true'){
                        
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
      let date = req.query.date
      let modifiedDate;
      
      if(date != null && date.length > 0){
            console.log('using req date '+ req.query.date);
            let d = date.split('-');
            modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
      }else{
            modifiedDate = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
      }
      let SavedData = await Visits.findOne({
            PatientId:req.params.id,
            Date:modifiedDate
      });
      console.log('abc')
      console.log(SavedData);
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
module.exports.getOldPrescriptionForm = async function(req, res){
      console.log(req.params);
      console.log(req.query);
      let d = req.query.date.split('-');
      let modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
      let visit = await Visits.findOne({PatientId:req.params.patientId, Date:modifiedDate }).populate('PatientId');
      console.log(visit);
      return res.render('prescriptionForm_old', {visit})
      
}
module.exports.medicationsPage = async function(req, res){
      let patient = await Patients.findById(req.params.patientId);
      let inventory = await Inventories.find({}).distinct('Medicine');
      console.log(inventory)
      return res.render('medications',{patient, inventory})
}

module.exports.savePrescriptions = async function(req,res){
      try{
            let savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            });
            if(!savedData){
                  return res.status(403).json({
                        message:'Visit not completed'
                  })
            }
            let receivedPres = req.body.prescriptions;
            
            let preparedPres = []
            for(let i=0;i<receivedPres.length;i++){
                  if(receivedPres[i].length > 0){
                        preparedPres.push(receivedPres[i])
                        splittedArray = receivedPres[i].split(':');
                        let deductableQty = Number(splittedArray[7]);
                        let inventory = await Inventories.find({Medicine:splittedArray[0]}).sort('ExpiryDate');
                        let totalAvailableQty = 0
                        for(let i=0;i<inventory.length;i++){
                              totalAvailableQty = totalAvailableQty + Number(inventory[i].CurrentQty);
                        }
                        console.log("QDY "+deductableQty)
                        if(totalAvailableQty >= deductableQty){
                              for(let i=0;i<inventory.length;i++){
                                    console.log("deductable qty is "+deductableQty)
                                    if(inventory[i].CurrentQty >= deductableQty){
                                          let newQty = inventory[i].CurrentQty - deductableQty
                                          await inventory[i].updateOne({CurrentQty:newQty})
                                          break
                                    }else{
                                          deductableQty = deductableQty - inventory[i].CurrentQty
                                          await inventory[i].updateOne({CurrentQty:0});
                                    }
                              }
                        }else{
                              return res.status(200).json({
                                    message:'Quantity over',
                                    visitId : savedData._id
                              })
                        }
                  }

            }
            await savedData.updateOne({Prescriptions:preparedPres});
            return res.status(200).json({
                  message:'Prescriptions added',
                  visitId : savedData._id
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to add prescriptions'
            })
      }
}

module.exports.getPrescriptions = async function(req, res){
      try{
            let date = req.query.date
            let modifiedDate;
            console.log(req.body);
            if(date != null){
                  console.log('using req date '+ req.query.date);
                  let d = date.split('-');
                  modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
            }else{
                  modifiedDate = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            }
            console.log(modifiedDate)
            let savedData = await Visits.findOne({
                  PatientId:req.query.patientId,
                  Date:modifiedDate
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


module.exports.patientHistoryHome = async function(req, res){
      let patient = await Patients.findById(req.params.id)
      return res.render('patientHistory', {patient});
}

module.exports.getPatientHistory = async function(req, res){
      let history = await Visits.find({PatientId:req.params.id}).sort({createdAt:-1});
      return res.status(200).json({
            history
      })
}