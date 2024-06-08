const propertiesReader = require('properties-reader');
const Patients = require('../models/patients');
const Appointments = require('../models/appointments');
const Visits = require('../models/visits');
const Tracker = require('../models/tracker');
const Inventories = require('../models/inventory');
const Sales = require('../models/sales');
const AdmittedPatients = require('../models/admittedPatients')
module.exports.addNewPatient = async function(req, res){
      let bookedAppointment = null;
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
                        bookedAppointment = await Appointments.create({
                              PatientId:patient._id,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate(),
                              isVisited:false,
                              Fees: req.body.Fees
                        })
                        await Sales.create({
                              BillAmount:req.body.Fees,
                              BillLink:'/appointments/receipt/'+bookedAppointment._id,
                              BillType:'Registration Fees',
                              PatientId:patient._id,
                              SaleDate:new Date().getFullYear() +'-'+ String((Number(new Date().getMonth()) + 1)).padStart(2,'0') +'-'+ String(new Date().getDate()).padStart(2,'0'),
                        })
                  }
                  
            }catch(err){
                  console.log(err);
                  return res.status(500).json({
                        message:'Patient Created, Unable to add appointment'
                  })
            }
            
            return res.status(200).json({
                  patientId:patient._id,
                  appointment:bookedAppointment,
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

module.exports.newVisit = async function(req, res){
      if(req.user.role == 'Admin'){
            let inventory = await Inventories.find({}).distinct('Medicine');
            let patient, properties, date, modifiedDate
            try{
                  properties = propertiesReader('./properties/UIdata.properties');
            }catch(err){
                  console.log('Unable to load properties : /projectloaction/properties/UIdata.properties')
                  return res.redirect('back')
            }
            try{
                  patient = await Patients.findById(req.params.id)
                  date = req.query.date
            }catch(err){
                  console.log(err)
                  console.log('DB error : Unable to find patient')
                  return res.redirect('back')
            }
            
            
            if(date != null && date.length > 0){
                  let d = date.split('-');
                  modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
            }else{
                  modifiedDate = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            }
            let SavedData;
            try{
                  SavedData = await Visits.findOne({
                        PatientId:req.params.id,
                        Date:modifiedDate
                  });
            }catch(err){
                  console.log("DB Error : Error fetching saved data")
                  console.log(err)
            }
            let OE = properties.get('OnExaminations').split(',');
            return res.render('visitPad',{OE, patient, SavedData,role:req.user.role,inventory});
      }else{
            return res.render('Error_403')
      }     
}

module.exports.patientRegistration = function(req, res){
      return res.render('patientRegistration',{role:req.user.role});
}

module.exports.IPDpatientRegistration = function(req, res){
      return res.render('IPDRegistration',{role:req.user.role});
}

module.exports.addExaminations = async function(req, res){
      if(req.user.role == 'Admin'){
            try{
                  let keys = Object.keys(req.body);
                  let dataInArray = [];
                  for(let i=0;i<keys.length;i++){
                        dataInArray.push(keys[i]+":"+req.body[keys[i]]);
                  }
                  let savedData;
                  try{
                        savedData = await Visits.findOne({
                              PatientId:req.params.patientId,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                        });
                  }catch(err){
                        console.log("DB error : Unable to fetch saved data for patient")
                        console.log(err)
                  }
                  try{
                        if(savedData){
                              console.log('Updating in saved data')
                              await savedData.updateOne({OEs:dataInArray});
                        }else{
                              console.log('No old visits found : Creating new Visit')
                              let visit = await Visits.create({
                                    PatientId:req.params.patientId,
                                    OEs:dataInArray
                              });
                              await visit.updateOne({Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()});
                        }
                  }catch(err){
                        console.log(err);
                        return res.status(500).json({
                              message:'Unable to save data'
                        })
                  }
                  try{
                        await Appointments.findOneAndUpdate({
                              PatientId:req.params.patientId,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                        },{
                              isVisited:true
                        })
                  }catch(err){
                        console.log('DB error : Unable to update appointment status')
                  }
                  
                  return res.status(200).json({
                        message:'OEs Updated'
                  })
            }catch(err){
                  return res.status(500).json({
                        message:'Unable to update OEs'
                  })
            }
      }else{
            return res.render('Error_403')
      }
}

module.exports.addTests = async function(req, res){
      if(req.user.role == 'Admin'){
            try{
                  let keys = Object.keys(req.body);
                  let dataInArray = [];
                  let savedData
                  for(let i=0;i<keys.length;i++){
                        dataInArray.push(keys[i]+":"+req.body[keys[i]]);
                  }
                  try{
                        savedData = await Visits.findOne({
                              PatientId:req.params.patientId,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                        });
                  }catch(err){
                        console.log("DB error : Unable to find old data for patient")
                  }
                  try{
                        if(savedData){
                              console.log("Saving is old data")
                              await savedData.updateOne({Tests:dataInArray});
                        }else{
                              console.log("Creating new visit record")
                              let visit = await Visits.create({
                                    PatientId:req.params.patientId,
                                    Tests:dataInArray
                              });
                              await visit.updateOne({Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()});
                        }
                  }catch(err){
                        console.log(err)
                        return res.status(500).json({
                              message:'Unable to add data'
                        })
                  }
                  try{
                        await Appointments.findOneAndUpdate({
                              PatientId:req.params.patientId,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                        },{
                              isVisited:true
                        })
                  }catch(err){
                        console.log("Unable to update appointment status")
                  }
                  
                  return res.status(200).json({
                        message:'Tests Updated'
                  })
            }catch(err){
                  return res.status(500).json({
                        message:'Unable to update Tests'
                  })
            }
      }else{
            return res.render('Error_403')
      }
}

module.exports.addComplaint = async function(req, res){
      if(req.user.role == 'Admin'){
            try{
                  let savedData = await Visits.findOne({
                        PatientId:req.params.patientId,
                        Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                  });
                  try{
                        if(savedData){
                              console.log('Updating complaints in saved data')
                              await savedData.updateOne({Complaint:req.body.Complaint});
                        }else{
                              console.log('creating new visit record for complaints')
                              let visit = await Visits.create({
                                    PatientId:req.params.patientId,
                                    Complaint:req.body.Complaint,
                                    Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                              });
                        }
                  }catch(err){
                        console.log(err)
                        return res.status(500).json({
                              message:'Unable to add complaints'
                        })
                  }
                  try{
                        await Appointments.findOneAndUpdate({
                              PatientId:req.params.patientId,
                              Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                        },{
                              isVisited:true
                        })
                  }catch(err){
                        console.log("DB error : unable to change appointment status")
                        console.log(err)
                  }
                  
                  return res.status(200).json({
                        message:'Complaint Updated'
                  })
            }catch(err){
                  console.log(err)
                  return res.status(500).json({
                        message:'Unable to update complaint'
                  })
            }
      }else{
            return res.render('Error_403')
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
      let patient
      try{
            patient = await Patients.findById(req.params.patientId);
      }catch(err){
            console.log(err);
            return res.redirect('back')
      }
      return res.render('prescriptionForm',{patient,role:req.user.role});
}
module.exports.getOldPrescriptionForm = async function(req, res){
      let d, modifiedDate, visit;
      try{
            d = req.query.date.split('-');
            modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
            visit = await Visits.findOne({PatientId:req.params.patientId, Date:modifiedDate }).populate('PatientId');
      }catch(err){
            console.log(err)
            return res.redirect('back')
      }
      return res.render('prescriptionForm_old', {visit,role:req.user.role})
}
module.exports.medicationsPage = async function(req, res){
      let patient, inventory;
      try{
            patient = await Patients.findById(req.params.patientId);
      }catch(err){
            console.log(err)
            return res.redirect('back')
      }
      try{
            inventory = await Inventories.find({}).distinct('Medicine');
      }catch(err){
            console.log("DB Error : Unable to fetch inventories")
      }
      return res.render('medications',{patient, inventory,role:req.user.role})
}

module.exports.savePrescriptions = async function(req,res){
      try{
            let savedData
            try{
                  savedData = await Visits.findOne({
                        PatientId:req.params.patientId,
                        Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
                  });  
            }catch(err){
                  console.log("No old data found")
            }
            if(!savedData){
                  return res.status(403).json({
                        message:'Visit not completed'
                  })
            }
            let receivedPres = req.body.prescriptions;
            let preparedPres = []
            let totalAmount = 0
            try{
                  for(let i=0;i<receivedPres.length;i++){
                        if(receivedPres[i].length > 0){
                              preparedPres.push(receivedPres[i])
                              splittedArray = receivedPres[i].split(':');
                              totalAmount = totalAmount + (Number(splittedArray[6]) * Number(splittedArray[7]));
                              let deductableQty = Number(splittedArray[7]);
                              let inventory = await Inventories.find({Medicine:splittedArray[0]}).sort('ExpiryDate');
                              let totalAvailableQty = 0
                              for(let i=0;i<inventory.length;i++){
                                    totalAvailableQty = totalAvailableQty + Number(inventory[i].CurrentQty);
                              }
                              if(totalAvailableQty >= deductableQty){
                                    for(let i=0;i<inventory.length;i++){
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

                  try{
                        await Sales.create({
                              PatientId:req.params.patientId,
                              BillAmount:totalAmount,
                              BillType:'Medical Bill',
                              BillLink:'/visits/getMedicalBill/'+savedData._id,
                              SaleDate:new Date().getFullYear() +'-'+ String((Number(new Date().getMonth()) + 1)).padStart(2,'0') +'-'+ String(new Date().getDate()).padStart(2,'0'),
                        })
                  }catch(err){
                        console.log("Unable to add in sales")
                  }
            }catch(err){
                  console.log("Unable to update inventoreis")
            }
            await savedData.updateOne({Prescriptions:preparedPres, medDiscount:req.body.discount});
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
            if(date != null){
                  console.log('using req date '+ req.query.date);
                  let d = date.split('-');
                  modifiedDate =  d[0]+'-'+String(Number(d[1]))+'-'+String(Number(d[2]));
            }else{
                  modifiedDate = new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            }
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
      if(req.user.role == 'Admin'){
            let patient
            try{
                  patient = await Patients.findById(req.params.id)
            }catch(err){
                  console.log('DB Error : Unable to find patient')
                  return res.redirect('back')
            } 
            return res.render('patientHistory', {patient,role:req.user.role});
      }else{
            return res.render('Error_403')
      }
      
}

module.exports.getPatientHistory = async function(req, res){
      if(req.user.role == 'Admin'){
            let history
            try{
                  history = await Visits.find({PatientId:req.params.id}).sort({createdAt:-1});
            
            }catch(err){
                  console.log('DB Error : Unable to find patient history')
                  return res.status(500).json({
                        message:'Unable to fetch history'
                  })
            }
            return res.status(200).json({
                  history
            })
      }else{
            return res.render('Error_403')
      }
           
}

module.exports.getRegistrationReceipt = async function(req, res){
      try{
            let patient = await Patients.findById(req.params.id)
            return res.render('registrationReceipt',{patient,role:req.user.role})
      }catch(err){
            return res.redirect('back')
      }
}

module.exports.admitPatient = async function(req, res){
      let id;
      try{
            id = await Tracker.findOne({});
      }catch(err){
            return res.status(500).json({
                  message:'Unable to generate patient ID'
            })
      }
      try{
            let patient = await AdmittedPatients.create(req.body);
            let newId = Number(id.AdmittedPatientId) + 1
            await id.updateOne({AdmittedPatientId:newId})
            await patient.updateOne({PatientId:newId})
            return res.status(200).json({
                  message:'Patient Admitted'
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to admit patient'
            })
      }
}

module.exports.showAdmitted = async function(req, res){
      try{
            let patients = await AdmittedPatients.find({}).sort([['createdAt',-1]]);
            return res.render('showAdmittedPatients',{patients,role:req.user.role})
      }catch(err){
            console.log(err)
            return res.render('showAdmittedPatients',{patients:null,role:req.user.role})
      }
      
}

module.exports.saveOperationsData = async function(req, res){
      try{
            let patient = await AdmittedPatients.findById(req.body.id);
            await patient.updateOne({OperationDate:req.body.opdate, OperationDescription:req.body.opdesc, Remarks:req.body.remarks, Complaint:req.body.cnh})
            return res.status(200).json({
                  message:'Admission Details Updated'
            })
      }catch(err){
            console.log(err)
            return res.status(500).json({
                  message:'Unable to save data'
            })
      }
}

module.exports.dischargePatient = async function(req, res){
      try{
            if(req.user.role == 'Admin'){
                  await AdmittedPatients.findByIdAndUpdate(req.body.id, {isDischarged:true, DischargeDate:new Date()});
                  return res.status(200).json({
                        message:'Patient discharge completed'
                  })
            }else{
                  return res.status(403).json({
                        message:'You are not authorized to perform this action'
                  })
            }
            
      }catch(err){
            console.log(err);
            return res.status(500).json({
                  message:'Unable to discharge patient'
            })
      }
}

module.exports.dischargeSheet = async function(req, res){
      try{
            let patient = await AdmittedPatients.findById(req.params.id);
            return res.render('dischargeSheet', {patient})
      }catch(err){
            console.log(err)
            return res.render('Error_500')
      }
}


module.exports.savePrescriptionsDoctor = async function(req, res){
      console.log(req.body)
      try{
            let savedData;
            savedData = await Visits.findOne({
                  PatientId:req.params.patientId,
                  Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()
            }); 
            if(savedData){
                  await savedData.updateOne({WrittenPrescriptions:req.body.items})
            }else{
                  let visit = await Visits.create({
                        PatientId:req.params.patientId,
                        WrittenPrescriptions:req.body.items
                  });
                  await visit.updateOne({Date:new Date().getFullYear() +'-'+ (Number(new Date().getMonth()) + 1) +'-'+ new Date().getDate()});
            }
            
            return res.status(200).json({
                  message:'Prescriptions Saved'
            })
      }catch(err){
            return res.status(500).json({
                  message:'Unable to add prescriptions'
            })
      }

}